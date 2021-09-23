const express = require('express')

const { Server: HttpServer } = require('http')
const { Server: Socket } = require('socket.io')

const Producto = require('./api/productos.js')
const Mensajes = require('./api/mensajes.js')

const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)

const productosApi = new Producto()
const mensajesApi = new Mensajes('AllMessages.json')


io.on('connection', async socket => {
    const connectionId = socket.id;
    console.log(`Cliente conectado! ID: ${connectionId}`);

    socket.emit('productos', productosApi.getAll());

    socket.on('save', producto => {
        productosApi.save(producto)
        io.sockets.emit('productos', productosApi.getAll());
    })

    socket.emit('mensajes', await mensajesApi.getAll());

    socket.on('nuevoMensaje', async mensaje => {
        mensaje.fyh = new Date().toLocaleString()
        await mensajesApi.save(mensaje)
        io.sockets.emit('mensajes', await mensajesApi.getAll());
    })
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

const PORT = 8080
const connectedServer = httpServer.listen(PORT, () => {
    console.log(`Servidor http escuchando en el puerto ${connectedServer.address().port}`)
})
connectedServer.on('error', error => console.log(`Error en servidor ${error}`))
