const ApiError = require("../error/ApiError");
const Productos = require("../api/productos");
const SaveToFile = require("../api/saveToFile");
const express = require("express");
const { Router } = express;

//Var que simula Admin user
const isAdmin = false;
//Memoria
const productos = new Productos();
//FS
const productosFS = new SaveToFile('ContenedorProductos.json');

const router = new Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


router.get("/:id?", (req, res, next) => {
  if (!req.params.id) {
    //FS
    // return res.json(productosFS.getAll());
    //Memoria
    return res.json(productos.getAll());
  } else {
    const response = productos.getById(req.params.id);
    if (response.error) {
      next(ApiError.notFound("producto no encontrado"));
      return;
    }
    //FS
    // return res.json(productosFS.getById(req.params.id));
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
  //FS
  productosFS.update( req.body,req.params.id)
  //Memoria
  res.json(productos.modifyById(req.params.id, req.body));
});
router.delete("/:id", (req, res) => {
  //FS
  productosFS.delete(req.params.id)
  //Memoria
  res.json(productos.deleteById(req.params.id));
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
  //FS
  productosFS.save(req.body)
  //Memoria
  res.json(productos.save(req.body));
  next();
});



module.exports = router;
