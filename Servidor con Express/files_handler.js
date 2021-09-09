const fs = require("fs");

const leerArchivo = async (archivo) => {
    try {
        console.log('################################')
        console.log(`Leyendo Archivo:${archivo}`);
        const result = await fs.promises.readFile(archivo, "utf8");
        return result;
    
      } catch (error) {
        console.error('Manejado con Bloque try/cath-->'+error);
      }
}

const escribirArchivo = async (archivo, contenidoToEscribir) => {
  try {
    console.log('################################')
    console.log(`Escribiendo Archivo:${archivo}`);
    const result = await fs.promises.writeFile(archivo, contenidoToEscribir);
    return result;
  } catch (error) {
    console.error('Manejado con Bloque try/cath-->'+error);

  }
};

module.exports = {
    leerArchivo,
    escribirArchivo
}

