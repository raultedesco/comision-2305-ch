const Contenedor = require("./contendor");
const express = require("express");
const app = express();

const getDataInFile = async () => {
  const archivo = new Contenedor("productos.txt");
  const response = await archivo.getAll();
  return response;
};

app.get("/productos", async (req, res) => {
  const response = await getDataInFile();
  console.log(response)
  res.json(response);
});
app.get("/productoRandom", async (req, res) => {
  const response = await getDataInFile();
  const randomId = Math.floor(Math.random() * response.length);
  res.json(response[randomId]);
});
const port = 8080;
app.listen(port, () => {
  console.log(`Listening on port:${port}`);
});


