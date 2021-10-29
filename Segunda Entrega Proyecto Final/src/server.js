const express = require("express");
const router = require('./router/productos')
const carrito = require('./router/carrito')
const apiErrorHandler = require('./error/api_error_handler')
const app = express();

app.use('/', express.static('public'));
app.use("/api/productos", router);
app.use("/api/carrito", carrito);


//Api Error Handler
app.use(apiErrorHandler);


/* Server Listen */
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
