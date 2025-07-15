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
    this.pokemon = null; // Imagen de Pokémon asociada
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
  cliente.pokemon = c.pokemon || null;
  return cliente;
});

function guardarClientes() {
  localStorage.setItem("clientes", JSON.stringify(registroDeClientes));
}

function agregarCliente(cliente) {
  obtenerPokemonAleatorio().then((url) => {
    cliente.pokemon = url;
    registroDeClientes.push(cliente);
    guardarClientes();
    verClientesHTML();
  });
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

  listaDiv.innerHTML = "";
  registroDeClientes.forEach((c) => {
    const fila = document.createElement("div");
    fila.className = "cliente-fila row align-items-center mb-2";
    fila.innerHTML = `
      <div class="col datos1">${c.id}</div>
      <div class="col cajaDeDatos">ID</div>
      <div class="col datos1">${c.nombre} ${c.apellido}</div>
      <div class="col cajaDeDatos">Nombre</div>
      <div class="col datos1">${c.dni}</div>
      <div class="col cajaDeDatos">DNI</div>
      <div class="col datos1">${c.numeroContacto}</div>
      <div class="col cajaDeDatos">Contacto</div>
      <div class="col datos1">${c.dispositivoAReparar}</div>
      <div class="col cajaDeDatos">Dispositivo</div>
      <div class="col datos1">${c.reparacion}</div>
      <div class="col cajaDeDatos">Reparacion</div>
      <div class="col datos1">${c.costo}</div>
      <div class="col cajaDeDatos">Costo</div>
      <div class="col datos1">${c.estado}</div>
      <div class="col cajaDeDatos">Estado</div>
      <div class="col"><img src="${c.pokemon}" alt="pokemon" style="height:50px"></div>
      <div class="col-auto">
        <button class="btn btn-danger btn-sm me-1 btn-eliminar">Eliminar</button>
        <button class="btn btn-secondary btn-sm" onclick="editarEstadoPrompt(${c.id})">Editar</button>
      </div>
    `;

    fila.querySelector(".btn-eliminar").addEventListener("click", () => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          eliminarCliente(c.id);
          Swal.fire({
            title: "Eliminado",
            text: "El cliente ha sido eliminado.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      });
    });

    listaDiv.appendChild(fila);
  });
}

function obtenerPokemonAleatorio() {
  const id = Math.floor(Math.random() * 150) + 1;
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((res) => res.json())
    .then((data) => data.sprites.front_default);
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
