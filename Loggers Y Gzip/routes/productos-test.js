import express from "express";
import { Router } from "express";
import logger from '../utils/logger.js'
const routerProductosTest = new Router();

import faker from "faker";
faker.locale = "es";

routerProductosTest.get("/productos-test", (req, res) => {
  const { url, method } = req;
  logger.info(`${method} ${url}`);
  const productos = [];
  for (let index = 1; index <= 5; index++) {
    const p_n = {
      id: index,
      title: faker.commerce.product(),
      price: faker.commerce.price(),
      thumbnail: `${faker.image.imageUrl()}?${index}`,
    };
    productos.push(p_n);
  }

  res.json(productos);
});

export { routerProductosTest };
