import express from 'express';
import  { Server as HttpServer } from 'http';
import { Server as Socket } from 'socket.io';

import ClienteSql from './api/sql.js'
import { options_mariadb } from './options/mariaDB.js'
import { options_sqlite3 } from './options/sqlite3.js'

const table_mensajes = 'mensajes'
const table_productos = "productos";

const mensajesApi = new ClienteSql(options_sqlite3,table_mensajes)
const productosApi = new ClienteSql(options_mariadb,table_productos)


const app = express()
const httpServer = new HttpServer(app)
const io = new Socket(httpServer)



io.on('connection', async socket => {
    const connectionId = socket.id;
    console.log(`Cliente conectado! ID: ${connectionId}`);

    socket.emit('productos', await productosApi.getAll());

    socket.on('save', async producto => {
        await productosApi.insertar([producto])
        io.sockets.emit('productos', await productosApi.getAll());
    })


    socket.emit('mensajes', await mensajesApi.getAll());

    socket.on('nuevoMensaje', async mensaje => {
        // mensaje.fyh = new Date().toLocaleString()
        await mensajesApi.insertar([mensaje])
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
