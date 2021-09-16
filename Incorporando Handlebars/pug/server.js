const express = require("express");

const Productos = require("./api/productos");
const productos = new Productos();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', './views');
app.set('view engine', 'pug');

app.use('/', express.static('public'));

app.post('/productos', (req, res) => {
  const producto = req.body
  productos.save(producto)
  res.redirect('/')
})

app.get('/productos', (req, res) => {
  const productos_all = productos.getAll()
  res.render("main", {
      productos: productos_all,
      countProductos: productos_all.length
  });
});


/* Server Listen */
const PORT = 8080;
const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});
server.on("error", (error) => console.log(`Error en servidor ${error}`));
