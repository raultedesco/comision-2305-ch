const ApiError = require("../error/ApiError");
const Productos = require("../api/productos");
const express = require("express");
const { Router } = express;

const productos = new Productos();
const router = new Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", (req, res) => {
  res.json(productos.getAll());
});
//Implementacion de un manejador de errores para este post, producto no encontrado.
router.get("/:id", (req, res, next) => {
  const response = productos.getById(req.params.id)
  if(response.error){
    next(ApiError.notFound("producto no encontrado"));
    return;

  }
  res.json(response);
});

router.put("/:id", (req, res) => {
  res.json(productos.modifyById(req.params.id, req.body));
});
router.delete("/:id", (req, res) => {
  res.json(productos.deleteById(req.params.id));
});

//Implementacion de un manejador de errores para este post, los 3 campos son obligatorios.
router.post("/", (req, res, next) => {
  const { title,price,thumbnail } = req.body;
  if (!(title && price && thumbnail)) {
    next(ApiError.badRequest("Los campos title, price y thumbnail son obligatorios! "));
    return;
  }
  res.json(productos.save(req.body));
});

module.exports = router;
