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

  let mensaje = `
      
  <div class="container ">
    <div class="row bg-primary text-white fw-bold text-center py-2">
      <div class="col">ID</div>
      <div class="col">Nombre</div>
      <div class="col">DNI</div>
      <div class="col">Contacto</div>
      <div class="col">Dispositivo</div>
      <div class="col">Reparación</div>
      <div class="col">Costo</div>
      <div class="col">Estado</div>
      
    </div>
`;

  registroDeClientes.forEach((c) => {
    mensaje += `
    <div class="row g-3 border rounded p-2 my-2 cliente-fila">
      <div class="col-12 col-sm"><strong>ID:</strong> ${c.id}</div>
      <div class="col-12 col-sm"><strong>Nombre:</strong> ${c.nombre} ${c.apellido}</div>
      <div class="col-12 col-sm"><strong>DNI:</strong> ${c.dni}</div>
      <div class="col-12 col-sm"><strong>Contacto:</strong> ${c.numeroContacto}</div>
      <div class="col-12 col-sm"><strong>Dispositivo:</strong> ${c.dispositivoAReparar}</div>
      <div class="col-12 col-sm"><strong>Reparación:</strong> ${c.reparacion}</div>
      <div class="col-12 col-sm"><strong>Costo:</strong> $${c.costo}</div>
      <div class="col-12 col-sm"><strong>Estado:</strong> ${c.estado}</div>
      <div class="col-12 col-sm-auto d-flex flex-wrap gap-1">      
      </div>
        <button class="btn btn-danger btn-sm me-1" onclick="eliminarCliente (${c.id})">Eliminar</button>
        <button class="btn btn-secondary btn-sm" onclick="editarEstadoPrompt(${c.id})">Editar</button>
    </div>
  `;
  });

  mensaje += `</div>`;
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

// ==== EVENTOS DOM ====

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formularioCliente");
  const listaDiv = document.getElementById("listaClientes");

  document.getElementById("btnLogin").addEventListener("click", () => {
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("password").value;
    if (login(user, pass)) {
      Swal.fire({
        title: "Login Exitoso!",
        icon: "success",
        draggable: true,
      });
      document.getElementById("loginSection").style.display = "none";
      document.getElementById("appSection").style.display = "block";
    } else {
      Swal.fire({
        title: "Usuario o contraseña incorrectos",
        icon: "warning",
        draggable: true,
      });
    }
  });

  document
    .getElementById("registrarFormulario")
    .addEventListener("click", () => {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: "cliente Registrado con exito",
        showConfirmButton: false,
        timer: 1500,
      });
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
