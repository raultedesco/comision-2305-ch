const socket = io.connect();

const formAgregarProducto = document.getElementById('formAgregarProducto')
formAgregarProducto.addEventListener('submit', e => {
    e.preventDefault()
    const producto = {
        title: formAgregarProducto[0].value,
        price: formAgregarProducto[1].value,
        thumbnail: formAgregarProducto[2].value
    }
    socket.emit('save', producto);
    formAgregarProducto.reset()
})


socket.on('productos', manejarEventoProductos);

async function manejarEventoProductos(productos) {
    const recursoRemoto = await fetch('plantillas/tabla-productos.hbs')
    const textoPlantilla = await recursoRemoto.text()
    const functionTemplate = Handlebars.compile(textoPlantilla)
    const html = functionTemplate({ productos })
    document.getElementById('productos').innerHTML = html
}


const mail = document.getElementById('mail')
const message = document.getElementById('message')
const btnEnviar = document.getElementById('btnEnviar')

const formEnviarMensaje = document.getElementById('formEnviarMensaje')
formEnviarMensaje.addEventListener('submit', e => {
    e.preventDefault()

    const mensaje = { autor: mail.value, texto: message.value }
    socket.emit('nuevoMensaje', mensaje);
    formEnviarMensaje.reset()
    message.focus()
})

socket.on('mensajes', mensajes => {
    const html = mensajes.map(mensaje => {
        return (`
            <div>
                <b style="color:blue;">${mensaje.autor}</b>
                [<span style="color:maroon;">${mensaje.fyh}</span>] :
                <span style="color:green;font-style: italic">${mensaje.texto}</span>
            </div>
        `)
    }).join("<br>");
    document.getElementById('mensajes').innerHTML = html;
})


mail.addEventListener('input', () => {
    const content_mail = mail.value.length
    const content_mensaje = message.value.length
    message.disabled = !content_mail
    btnEnviar.disabled = !content_mail || !content_mensaje
})

message.addEventListener('input', () => {
    const content_mensaje = message.value.length;
    btnEnviar.disabled = !content_mensaje;
})
