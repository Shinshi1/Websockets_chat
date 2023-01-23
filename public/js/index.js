const socket = io()
console.log('been here')

// Sweat Alert2
let username;
const usernameAlert = Swal.fire({
    title: 'Identificate',
    text: 'Ingresa tu nombre para entrar al chat',
    input: 'text',
    inputValidator: (value) => {
        return !value && 'necesitas escribir tu nombre'
    },
    allowOutsideClick: false,
}).then(res => {
    username = res.value
    socket.emit('nuevoCliente', { username })
})
// enviar un mensaje de que se conecta un nuevo cliente.


// DOM Conection
const chatBox = document.querySelector('#chatBox')
const messageLogsEl = document.querySelector('#messageLogs')


chatBox.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        if (chatBox.value.trim().length) { // Si el usuario escribio
            const mensaje = chatBox.value
            chatBox.value = '' //borra lo que el usario escribio al apretar 'Enter'
            socket.emit('mensaje', {
                username,
                mensaje
            })
        }
    }
})

// socket
socket.on('mensajes', data => {
    let messages = ''
    data.forEach((message) => {
        messages = messages + `${message.username} dice: ${message.mensaje} <br>`
    })
    messageLogsEl.innerHTML = messages;
})

// socket - Notificación de usuario nuevo conectado
socket.on('usuarioNuevoConectado', (usuarioNuevo) => {
    console.log(usuarioNuevo)
    Swal.fire({
        text: `se ha conectado ${usuarioNuevo.username}`,
        toast: true,
        position: 'top-right',
    })
})