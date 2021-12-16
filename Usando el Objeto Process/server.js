import express from "express";
import parseArgs from 'minimist'
import session from "express-session";
import MongoStore from "connect-mongo";

import { Server as HttpServer } from "http";
import { Server as Socket } from "socket.io";

import {routerLogin} from './routes/index.js'
import {routerProductosTest} from './routes/productos-test.js'
import {routerInfo} from './routes/info.js'
import { routerRandom } from "./routes/random.js";

import ClienteSql from "./api/sql.js";
import ContenedorArchivo from "./api/archivo.js";
import { options_mariadb } from "./options/mariaDB.js";
import { options_mongoAtlas } from "./options/mongoDB.js";
import { options_mongoLocal } from "./options/mongoDB.js";

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

app.set('view engine', 'ejs')

// session
// const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

// app.use(
//   session({
//     store: MongoStore.create({
//       mongoUrl: options_mongoLocal.cnxStr,
//       cmongoOptions: advancedOptions
//     }),
//     secret: "secreto",
//     resave: true,
//     saveUninitialized: true,
//     rolling: true,
//     cookie: {
//       maxAge: 600000
//     }
//   })
// );


// rutas login - register - home
app.use('/',routerLogin)
//Endpoint /api/productos-test
app.use('/api', routerProductosTest)

// ruta info
app.use('/info', routerInfo)
//ruta random
app.use('/api/random', routerRandom)


// const PORT = 8080;

const args = parseArgs(process.argv.slice(2))
console.log(args)
const PORT = args.port || 8080
const modo = args.modo || "fork"

const connectedServer = httpServer.listen(PORT, () => {
  console.log(
    `Servidor http escuchando en el puerto ${connectedServer.address().port}`
  );
});
connectedServer.on("error", (error) =>
  console.log(`Error en servidor ${error}`)
);
