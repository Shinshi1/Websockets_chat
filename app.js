import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io";

const app = express();
const PORT = 8080;
const httpServer = app.listen(PORT, () =>
  console.log(`Servidor escuchando en el puerto 8080`)
);

const io = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

let mensajes = []

io.on('connection', (socket) => {
  console.log('nuevo cliente')
  socket.on('mensaje', async (msj) => {
    mensajes.push(msj)
    io.emit('mensajes', mensajes)
    // escuchar el evento de que se conecto un nuevo cliente
  }) 
  socket.on('nuevoCliente', nuevoCliente => {
    // emitir los mensajes al nuevo cliente - (El cliente podra ver los mensajes anteriores)
    socket.emit('mensajes', mensajes);
    // Notificar a todos que se conecto un nuevo cliente
    socket.broadcast.emit('usuarioNuevoConectado', { username: nuevoCliente.username })
  });
});

