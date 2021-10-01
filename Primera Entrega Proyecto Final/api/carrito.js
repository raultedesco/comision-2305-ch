class ContenedorCarritos {
  constructor() {
    this.id_for_carritos = 0;
    this.carritos = [];
  }
  save_carrito() {
    const id_carrito = ++this.id_for_carritos
    this.carritos.push({
      id: id_carrito,
      timestamp: Date.now(),
      productos: []
    });
    return id_carrito
  }

  add_product(id_carrito, product) {
    // const product_saved = {...product,id:++this.id}
    // console.log(id_carrito)
    const carrito = this.getCarritoById(id_carrito);
    // console.log(carrito)
    if (!carrito.error) {
      carrito.productos.push({ ...product, timestamp: Date.now() });
      return "product added";
    } else {
      return carrito.error;
    }
  }

  getProductosByCarritoId(id) {
    const carrito = this.getCarritoById(id);
    if (carrito.error) {
      return carrito.error;
    } else {
      return carrito.productos;
    }
  }
  getCarritoById(id) {
    const carrito_by_id = this.carritos.find((x) => x.id === parseInt(id));
    return carrito_by_id ? carrito_by_id : { error: "carrito no encontrado" };
  }

  getAll_Carritos() {
    return this.carritos;
  }

  deleteCarritoById(id) {
    const idx_founded = this.carritos.findIndex((x) => x.id === parseInt(id));
    if (idx_founded != -1) {
      this.carritos.splice(idx_founded, 1);
      return { message: `Carrito id:${id} was deleted!` };
    } else {
      return { error: "Carrito no encontrado" };
    }
  }

  deleteProductoInCarritoByProductoId(id_carrito, id_producto) {
    const idx_carrito_founded = this.carritos.findIndex(
      (x) => x.id === parseInt(id_carrito)
    );
    if (idx_carrito_founded != -1) {
      const idx_producto_founded = this.carritos[
        idx_carrito_founded
      ].productos.findIndex((x) => x.id === parseInt(id_producto));
      if (idx_producto_founded != -1) {
        this.carritos[idx_carrito_founded].productos.splice(idx_producto_founded,1);
        return {
          message: `Product id:${idx_producto_founded} in  Carrito idx:${this.carritos[idx_carrito_founded].id} was deleted!`
        };
      } else {
        return { error: "Producto in Carrito no encontrado" };
      }
    } else {
      return { error: "Carrito no encontrado" };
    }
  }

  deleteAllCarritos() {
    return (this.carritos = []);
  }
}
p1 = {
  title: "Escuadra",
  price: 123.45,
  thumbnail:
    "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
  id: 1
};
p2 = {
  title: "Escuadra",
  price: 123.45,
  thumbnail:
    "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
  id: 2
};
// const c1 = new ContenedorCarritos();
// c1.save_carrito();
// c1.save_carrito();
// c1.add_product(1, p1);
// c1.add_product(1, p2);
// console.log(c1.getAll_Carritos());
// // console.log(c1.carritos[0].productos);
// console.log("-----------------------------");
// console.log("Productos by id de Carrito");
// console.log(c1.getProductosByCarritoId(1));
// // console.log(c1.deleteCarritoById(1))
// // console.log(c1.getAll_Carritos())
// console.log(c1.deleteProductoInCarritoByProductoId(1, 3));
// console.log(c1.getProductosByCarritoId(1));
module.exports = ContenedorCarritos;
