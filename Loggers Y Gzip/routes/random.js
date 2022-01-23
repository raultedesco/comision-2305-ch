/*-----------------------------------------------------------*/
import express from "express";
const { Router } = express;
const routerRandom = new Router();
routerRandom.use(express.json());
routerRandom.use(express.urlencoded({ extended: true }));
import logger from "../utils/logger.js";
// import { fork } from "child_process";

routerRandom.get("/", (req, res, next) => {
  const { url, method } = req;
  logger.info(`${method} ${url}`);
  const cant = req.query.cant;
  const cantidad = cant || 100000000;
  // const forked = fork("./utils/computo.js");

  // forked.on("message", (msg) => {
  //   if (msg == "listo") {
  //     forked.send(cantidad);
  //   } else {
  //     return res.json(msg);
  //   }
  // });
  
   //sin child_process
   let numeros = {};
   for (let i=0; i<1000; i++){
       numeros[i+1] = 0;
   }
   for (let i=0; i<cantidad; i++){
       let azar = Math.floor(Math.random() * 1000) + 1;
       numeros[azar]++;
   }
   return res.json(numeros)
});

export { routerRandom };
