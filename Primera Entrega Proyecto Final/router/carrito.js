const ApiError = require("../error/ApiError");
const ContenedorCarritos = require("../api/carrito");
const SaveToFile = require("../api/saveToFile");
const express = require("express");
const { Router } = express;
//Memoria
const carrito = new ContenedorCarritos();
//FS
const carritoFS = new SaveToFile('ContenedorCarrito.json');

const router = new Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


//Carrito 
//Crea un carrito y devuelve su id
router.post("/", (req, res) => {
  //Memoria
  const id_carrito = carrito.save_carrito()
  //FS
  carritoFS.save({
    id: id_carrito,
    timestamp: Date.now(),
    productos: []
  });
  res.json(id_carrito);
});

router.delete("/:id", (req, res) => {
  //FS
  carritoFS.delete(req.params.id)
  //Memoria
  res.json(carrito.deleteCarritoById(req.params.id));
});

//Productos en Carrito
router.get("/:id/productos", (req, res, next) => {
  console.log(req.params.id)
  //Memoria
  const response = carrito.getProductosByCarritoId(req.params.id)
  console.log(response)
  if(response.error){
    next(ApiError.notFound("Carrito Vacio!"));
    return;

  }
  //FS
  const responseFS = carritoFS.getProductByIdCarrito(req.params.id)
  console.log(responseFS)
  res.json(response);
});

router.post("/:id/productos", async (req, res,next) => {
  console.log(req.params.id)
  console.log( req.body)
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
  carritoFS.addProduct(req.params.id,req.body)
  //Memoria
  res.json(carrito.add_product(req.params.id, req.body));
  next();
});
router.delete("/:id/productos/:id_p", (req, res) => {
  carritoFS.deleteProductoInCarritoByProductoId(req.params.id,req.params.id_p)
  res.json(carrito.deleteProductoInCarritoByProductoId(req.params.id,req.params.id_p));
});




module.exports = router;
