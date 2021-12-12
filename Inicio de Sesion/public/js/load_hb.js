async function getProductosTest() {
    return fetch('/api/productos-test')
        .then(respuesta => respuesta.json())
}

async function manejarEventoProductos(productos) {
    const recursoRemoto = await fetch('plantillas/tabla-productos.hbs')
    const textoPlantilla = await recursoRemoto.text()
    const functionTemplate = Handlebars.compile(textoPlantilla)
    const html = functionTemplate({ productos })
    document.getElementById('productos_test').innerHTML = html
}

async function main(){
const productos = await getProductosTest()
console.log(productos)
manejarEventoProductos(productos)
}

main().then()