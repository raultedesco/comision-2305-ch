const ApiError = require("../error/ApiError");
const Productos = require("../api/productos");
const SaveToFile = require("../api/saveToFile");
const express = require("express");
import { productosDao as productosApi } from "../daos/index.js";
const { Router } = express;

//Var que simula Admin user
const isAdmin = false;

const router = new Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get("/:id?", (req, res, next) => {
  if (!req.params.id) {
    return res.json(productosApi.listar());
  } else {
    const response = productosApi.listar(req.params.id);
    if (response.error) {
      next(ApiError.notFound("producto no encontrado"));
      return;
    }
    res.json(response);
    next();
  }
});
//Implementacion de un middleware que intercepta todos las requests de este Router antes de put/post/delete y
// si la const global isAdmin es false y el method es diferente de GET  retorna 
//error code 401 Unauthorized +  x ejemplo { error: -1, descripcion: 'ruta /api/productos/ - 401 Unauthorized' }

router.use(function (req, res, next) {
  if (!isAdmin && !(req.method=='GET')) {
    next(
      ApiError.not_authorize(`ruta ${req.baseUrl}${req.url} - 401 Unauthorized`)
    );
    return;
  } else {
    next();
  }
});


router.put("/:id", (req, res) => {
  productosApi.actualizar( req.body)
});
router.delete("/:id", (req, res) => {
  productosApi.borrar(req.params.id)

});

//Implementacion de un manejador de errores para este post, los 6 campos son obligatorios.
router.post("/", (req, res, next) => {
  console.log(req.body)
  const { title, price, thumbnail, description, codigo, stock } = req.body;

  if (!(title && price && thumbnail && description && codigo && stock)) {
    next(
      ApiError.badRequest(
        "Los campos title, price,thumbnail, description,codigo y stock son obligatorios!"
      )
    );
    return;
  }
  res.json(productosApi.guardar(req.body));
  next();
});



module.exports = router;
