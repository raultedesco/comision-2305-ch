const { leerArchivo, escribirArchivo } = require("./files_handler");

class Contenedor {
  constructor(archivo) {
    this.id = 1;
    this.archivo = archivo;
    // const result = escribirArchivo(archivo, "").then((r) => console.log(r));
  }
  async save(objeto) {
    const contenidoLeido = await leerArchivo(this.archivo).then((res) => {
      if (res.length === 0) {
        console.log("Archivo Vacio");
        const objetoToSave = { ...objeto, id: this.id };
         const content = [objetoToSave];
        return { contenidoToSave: content, id: this.id };
      } else {

        console.log("Archivo con Contenido");
        const content = JSON.parse(res);
        console.log("content lenght", content.length);
        const lastItem = content[content.length - 1];
        this.id = lastItem.id + 1;
        content.find((x) => x.id === this.id) ? (this.id = this.id + 1) : "";
        const add = { ...objeto, id: this.id };
        content.push(add);
        return { contenidoToSave: content, id: this.id };
      }
    });
    const { contenidoToSave, id } = contenidoLeido;
    const contenToSave = escribirArchivo(
      this.archivo,
      JSON.stringify(contenidoToSave, null, 2)
    );
    return id;
  }
  async getById(id) {

    const objetoById = leerArchivo(this.archivo).then((res) => {
      if (res.length === 0) {
        console.log("No se puede buscar el id x el Archivo esta vacio");
      } else {

        const content = JSON.parse(res);
        const obj_by_id = content.find((x) => x.id === id);
        return obj_by_id ? obj_by_id : null;
      }
    });
    return objetoById;
  }
  async getAll() {
    const objetoAll = leerArchivo(this.archivo).then((res) => {
      if (res.length === 0) {
        return "No hay datos que mostrar... Archivo Vacio";
      } else {
        const content = JSON.parse(res);
        return content;
      }
    });
    return objetoAll;
  }

  async deleteById(id) {
    const contenido= await leerArchivo(this.archivo).then((res) => {
      if (res.length === 0) {
        console.log(`No se puede Borrar el producto con id:${id} por que el Archivo esta vacio`);
      } else {

        const content = JSON.parse(res);
        const arrayFiltrado = content.filter(function(valor, indice, arr){ 
          return valor.id != id;
      });
        return arrayFiltrado
      }
    });
    console.log(contenido)
    const contenToSave = await escribirArchivo(
      this.archivo,
      JSON.stringify(contenido, null, 2)
    );

  }

  async deleteAll() {
    this.id = 1;
    escribirArchivo(this.archivo, "").then((r) => console.log(r));
  }
}

module.exports = Contenedor;
