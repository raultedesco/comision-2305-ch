const socket = io.connect();

const formAgregarProducto = document.getElementById("formAgregarProducto");
formAgregarProducto.addEventListener("submit", (e) => {
  e.preventDefault();
  const producto = {
    title: formAgregarProducto[0].value,
    price: formAgregarProducto[1].value,
    thumbnail: formAgregarProducto[2].value
  };
  socket.emit("save", producto);
  formAgregarProducto.reset();
});

socket.on("productos", manejarEventoProductos);

async function manejarEventoProductos(productos) {
  const recursoRemoto = await fetch("plantillas/tabla-productos.hbs");
  const textoPlantilla = await recursoRemoto.text();
  const functionTemplate = Handlebars.compile(textoPlantilla);
  const html = functionTemplate({ productos });
  document.getElementById("productos").innerHTML = html;
}

const mail = document.getElementById("mail");
const message = document.getElementById("message");
const btnEnviar = document.getElementById("btnEnviar");

const schemaAuthor = new normalizr.schema.Entity(
  "author",
  {},
  { idAttribute: "id" }
);
const schemaMensaje = new normalizr.schema.Entity(
  "post",
  { author: schemaAuthor },
  { idAttribute: "_id" }
);
const schemaMensajes = new normalizr.schema.Entity(
  "posts",
  { mensajes: [schemaMensaje] },
  { idAttribute: "id" }
);

const formEnviarMensaje = document.getElementById("formEnviarMensaje");
formEnviarMensaje.addEventListener("submit", (e) => {
  e.preventDefault();

  const mensaje = {
    author: {
      email: mail.value,
      nombre: document.getElementById("nombre").value,
      apellido: document.getElementById("apellido").value,
      edad: document.getElementById("edad").value,
      alias: document.getElementById("alias").value,
      avatar: document.getElementById("avatar").value
    },
    text: message.value
  };
  socket.emit("nuevoMensaje", mensaje);
  formEnviarMensaje.reset();
  message.focus();
});

socket.on("mensajes", (mensajesN) => {
  let mensajesNsize = JSON.stringify(mensajesN).length;
  let mensajesD = normalizr.denormalize(
    mensajesN.result,
    schemaMensajes,
    mensajesN.entities
  );
  let mensajesDsize = JSON.stringify(mensajesD).length;
  let porcentajeC = parseInt((mensajesNsize * 100) / mensajesDsize);
  document.getElementById("compresion-info").innerText = porcentajeC;

  const html = mensajesD.mensajes
    .map((mensaje) => {
      return `
            <div>
                <b style="color:blue;">${mensaje.author.email}</b>
                [<span style="color:maroon;">${mensaje.fyh}</span>] :
                <span style="color:green;font-style: italic">${mensaje.text}</span>
                <img width="50" src="${mensaje.author.avatar}" alt=" "
            </div>
        `;
    })
    .join("<br>");
  document.getElementById("mensajes").innerHTML = html;
});

mail.addEventListener("input", () => {
  const content_mail = mail.value.length;
  const content_mensaje = message.value.length;
  message.disabled = !content_mail;
  btnEnviar.disabled = !content_mail || !content_mensaje;
});

message.addEventListener("input", () => {
  const content_mensaje = message.value.length;
  btnEnviar.disabled = !content_mensaje;
});

//endpoint session_user for name of user
// fetch("/session_user")
//   .then((response) => response.text())
//   .then(function (user) {
//     if (user) {
//       console.log('cliente.js line 108')
//       console.log(user);
//       let html = `
//                 <div class="container mt-3">
//                   <h2 style="color:green;">Bienvenido ${user}</h2>
//                   <button type="button" class="btn btn-warning" onclick=logout()>Logout</button>
//                 </div>
//             `;
//       document.getElementById("login").innerHTML = html;
//     } else {
//       window.location.replace("/login");
//     }
//   });
function logout() {
  fetch("/logout")
    .then((response) => response.text())
    .then(function (user) {
      if (user) {
        console.log(user);
        let clear = document.getElementById("4clear");
        clear.innerHTML = "";
        let html = `
        <div class="container mt-3">
            <div class="alert alert-danger">
              <h2>Hasta Luego ${user}!</h2>
            </div>
        </div>
              `;
        document.getElementById("login").innerHTML = html;
        setTimeout(function () {
          window.location.replace("/login");
        }, 2000);
      }
    });
}
