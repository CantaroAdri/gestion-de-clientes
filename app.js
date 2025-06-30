// ==== UTILIDADES Y CLASE CLIENTE ====

function creadoraDeIdAleatorio() {
  return Math.floor(Math.random() * 900000) + 100000;
}

class clienteCreado {
  constructor(
    nombre,
    apellido,
    dni,
    numeroContacto,
    dispositivoAReparar,
    reparacion,
    costo
  ) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.dni = dni;
    this.numeroContacto = numeroContacto;
    this.dispositivoAReparar = dispositivoAReparar;
    this.reparacion = reparacion;
    this.costo = costo;
    this.estado = "En espera";
    this.id = creadoraDeIdAleatorio();
  }

  setEstado(nuevoEstado) {
    this.estado = nuevoEstado;
  }
}

// ==== MANEJO DE CLIENTES ====

const datosGuardados = JSON.parse(localStorage.getItem("clientes")) || [];
const registroDeClientes = datosGuardados.map((c) => {
  const cliente = new clienteCreado(
    c.nombre,
    c.apellido,
    c.dni,
    c.numeroContacto,
    c.dispositivoAReparar,
    c.reparacion,
    c.costo
  );
  cliente.id = c.id;
  cliente.estado = c.estado;
  return cliente;
});

function guardarClientes() {
  localStorage.setItem("clientes", JSON.stringify(registroDeClientes));
}

function agregarCliente(cliente) {
  registroDeClientes.push(cliente);
  guardarClientes();
}

function eliminarCliente(id) {
  const index = registroDeClientes.findIndex((c) => c.id === id);
  if (index !== -1) {
    registroDeClientes.splice(index, 1);
    guardarClientes();
    verClientesHTML();
  }
}

function verClientesHTML() {
  const listaDiv = document.getElementById("listaClientes");

  if (registroDeClientes.length === 0) {
    listaDiv.innerText = "No hay clientes registrados.";
    return;
  }

  let mensaje =
    '<div class="container d-flex flex-column align-items-center gap-4">';
  registroDeClientes.forEach((c) => {
    mensaje += `
      <div class="card border-primary shadow-sm" style="width: 400px; height: 300px;">
        <div class="card-body bg-light rounded overflow-auto">
          <h5 class="card-title text-primary">${c.nombre} ${c.apellido}</h5>
          <p class="card-text text-dark">
            <strong>ID:</strong> ${c.id}<br>
            <strong>DNI:</strong> ${c.dni}<br>
            <strong>Contacto:</strong> ${c.numeroContacto}<br>
            <strong>Dispositivo:</strong> ${c.dispositivoAReparar}<br>
            <strong>Reparación:</strong> ${c.reparacion}<br>
            <strong>Costo:</strong> $${c.costo}<br>
            <strong>Estado:</strong> ${c.estado}<br>
          </p>
          <button class="btn btn-danger btn-sm me-1" onclick="eliminarCliente(${c.id})">Eliminar</button>
          <button class="btn btn-secondary btn-sm" onclick="editarEstadoPrompt(${c.id})">Editar Estado</button>
        </div>
      </div>
    `;
  });
  mensaje += "</div>";
  listaDiv.innerHTML = mensaje;
}

function editarEstadoHTML(id, nuevoEstado) {
  const index = registroDeClientes.findIndex((c) => c.id === id);
  if (index !== -1) {
    registroDeClientes[index].setEstado(nuevoEstado);
    guardarClientes();
    alert("Estado actualizado correctamente.");
    verClientesHTML();
  } else {
    alert("Cliente no encontrado.");
  }
}

function editarEstadoPrompt(id) {
  const nuevoEstado = prompt("Ingrese el nuevo estado para el cliente:");
  if (nuevoEstado) {
    editarEstadoHTML(id, nuevoEstado);
  }
}

function calcularCajaHTML() {
  let total = registroDeClientes.reduce(
    (acc, cliente) => acc + Number(cliente.costo),
    0
  );
  alert("Total en caja: $" + total);
}

// ==== LOGIN Y USUARIOS ====

if (!sessionStorage.getItem("nombreDeUsusario")) {
  sessionStorage.setItem("nombreDeUsusario", "admin");
  sessionStorage.setItem("passDelUsusario", "1234");
}

function login(usuario, contrasena) {
  const guardadoUsuario = sessionStorage.getItem("nombreDeUsusario");
  const guardadoPass = sessionStorage.getItem("passDelUsusario");
  return usuario === guardadoUsuario && contrasena === guardadoPass;
}

function registrarNuevoUsuario(usuario, pass) {
  if (usuario && pass) {
    sessionStorage.setItem("nombreDeUsusario", usuario);
    sessionStorage.setItem("passDelUsusario", pass);
    alert("Usuario registrado correctamente.");
  }
}

// ==== EVENTOS DOM ====

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formularioCliente");
  const listaDiv = document.getElementById("listaClientes");

  document.getElementById("btnLogin").addEventListener("click", () => {
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("password").value;
    if (login(user, pass)) {
      alert("Login exitoso");
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("appSection").style.display = "block";
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  });

  document
    .getElementById("btnMostrarFormulario")
    .addEventListener("click", () => {
      form.style.display = form.style.display === "none" ? "block" : "none";
    });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const nuevo = new clienteCreado(
      form.nombre.value,
      form.apellido.value,
      form.dni.value,
      form.contacto.value,
      form.dispositivo.value,
      form.reparacion.value,
      form.costo.value
    );
    agregarCliente(nuevo);
    form.reset();
    form.style.display = "none";
    verClientesHTML();
  });

  let listaVisible = false;
  document.getElementById("btnVerClientes").addEventListener("click", () => {
    listaVisible = !listaVisible;
    const listaDiv = document.getElementById("listaClientes");
    if (listaVisible) {
      verClientesHTML();
      listaDiv.style.display = "block";
    } else {
      listaDiv.style.display = "none";
    }
  });

  document.getElementById("btnEditarEstado").addEventListener("click", () => {
    const id = Number(prompt("Ingrese el ID del cliente"));
    const nuevoEstado = prompt("Ingrese el nuevo estado");
    editarEstadoHTML(id, nuevoEstado);
  });

  document.getElementById("btnCaja").addEventListener("click", () => {
    calcularCajaHTML();
  });
});
