const express = require("express");
const { Router } = express;

const ApiError = require("../error/ApiError");
import {
  carritosDao as carritosApi
} from '../daos/index.js'

const router = new Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));



//Carrito 
carritosRouter.get('/', async (req, res) => {
  res.json((await carritosApi.listarAll()).map(c => c.id))
})
//Crea un carrito y devuelve su id
router.post("/", async (req, res) => {
  const id_carrito = await carritosApi.guardar()
  res.json(id_carrito);
});

router.delete("/:id", (req, res) => {
  res.json(await carritosApi.borrar(req.params.id))
});

//Productos en Carrito
router.get("/:id/productos", (req, res, next) => {
  const carrito = await carritosApi.listar(req.params.id)
  res.json(carrito.productos)
});

router.post("/:id/productos", async (req, res,next) => {
  const carrito = await carritosApi.listar(req.params.id)
  const producto = await productosApi.listar(req.body.id)
  carrito.productos.push(producto)
  await carritosApi.actualizar(carrito)
});
router.delete("/:id/productos/:id_p", (req, res) => {
  const carrito = await carritosApi.listar(req.params.id)
  const index = carrito.productos.findIndex(p => p.id == req.params.idProd)
  if (index != -1) {
      carrito.productos.splice(index, 1)
      await carritosApi.actualizar(carrito)
  }
  res.end()
});




module.exports = router;
