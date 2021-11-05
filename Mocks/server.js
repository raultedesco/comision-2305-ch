import express from "express";
import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";

import faker from "faker";
faker.locale = "es";

import ClienteSql from "./api/sql.js";
import ContenedorArchivo from "./api/archivo.js";
import { options_mariadb } from "./options/mariaDB.js";

// const table_mensajes = 'mensajes'
const table_productos = "productos";

// const mensajesApi = new ClienteSql(options_sqlite3,table_mensajes)
const mensajesApi = new ContenedorArchivo("./DB/mensajes.json");
const productosApi = new ClienteSql(options_mariadb, table_productos);

const app = express();
const httpServer = new HttpServer(app);
const io = new Socket(httpServer);

import { normalize, schema } from "normalizr";

const schemaAuthor = new schema.Entity("author", {}, { idAttribute: "email" });

const schemaMensaje = new schema.Entity(
  "post",
  { author: schemaAuthor },
  { idAttribute: "id" }
);

const schemaMensajes = new schema.Entity(
  "posts",
  { mensajes: [schemaMensaje] },
  { idAttribute: "id" }
);

const normalizarMensajes = (mensajesConId) =>
  normalize(mensajesConId, schemaMensajes);

io.on("connection", async (socket) => {
  const connectionId = socket.id;
  console.log(`Cliente conectado! ID: ${connectionId}`);

  // Productos
  socket.emit("productos", await productosApi.getAll());

  socket.on("save", async (producto) => {
    console.log(producto);
    await productosApi.insertar([producto]);
    io.sockets.emit("productos", await productosApi.getAll());
  });

  socket.emit("mensajes", await getMensajesNormalizados());

  socket.on("nuevoMensaje", async (mensaje) => {
    console.log(mensaje);
    mensaje.fyh = new Date().toLocaleString();
    await mensajesApi.save(mensaje);
    io.sockets.emit("mensajes", await getMensajesNormalizados());
  });
});

async function getMensajesNormalizados() {
  const mensajes = await mensajesApi.getAll();
  const normalizados = normalizarMensajes({ id: "mensajes", mensajes });
  return normalizados;
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//Endpoint /api/productos-test
app.get("/api/productos-test", (req, res) => {
  const productos = [];
  for (let index = 1; index <= 5; index++) {
    const p_n = {
      id: index,
      title: faker.commerce.product(),
      price: faker.commerce.price(),
      thumbnail: `${faker.image.imageUrl()}?${index}`
    };
    productos.push(p_n);
  }

  res.json(productos);
});

const PORT = 8080;
const connectedServer = httpServer.listen(PORT, () => {
  console.log(
    `Servidor http escuchando en el puerto ${connectedServer.address().port}`
  );
});
connectedServer.on("error", (error) =>
  console.log(`Error en servidor ${error}`)
);
