import express from 'express'
import { Router } from 'express'

const routerProductosTest = new Router()


import faker from "faker";
faker.locale = "es";

routerProductosTest.get("/productos-test", (req, res) => {
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

export {routerProductosTest}