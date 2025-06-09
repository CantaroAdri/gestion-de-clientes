let admin = "admin";
let pass = 1234;
let logeo = false;
const registroDeClientes = [];

let estado = [];

function creadoraDeIdAleatorio() {
  return Math.floor(Math.random() * 900000) + 100000;
}


function buscadorPorID(id) {
  return registroDeClientes.findIndex(cliente => cliente.id === id);
}


function login(usuario, password) {
  if (usuario === admin && password == pass) {
    alert("Se logeó correctamente");
    return true;
  } else {
    alert("Usuario o contraseña incorrectos");
    return false;
  }
}

class clienteCreado{
  constructor(nombre, apellido, dni, numeroContacto, dispositivoAReparar, reparacion, costo){
this.nombre = nombre
this.apellido = apellido
this.dni = dni
this.numeroContacto = numeroContacto
this.dispositivoAReparar = dispositivoAReparar
this.reparacion = reparacion
this.costo = costo
this.estado = "En espera"
this.id = creadoraDeIdAleatorio()
  }

  setEstado (nuevoEstado){
    this.estado = nuevoEstado
  }
}

function agregarCliente(nombre, apellido, dni, numeroContacto, dispositivoAReparar, reparacion, costo) {
  let nuevoCliente = new clienteCreado (nombre,
    apellido,
    dni,
    numeroContacto,
    dispositivoAReparar,
    reparacion,
    costo,)
  
  registroDeClientes.push(nuevoCliente);
}

function verClientes() {
  if (registroDeClientes.length === 0) {
    alert("Aún no hay clientes registrados.");
    return;
  }

  let mensaje = "Clientes registrados:\n\n";
  registroDeClientes.forEach((c) => {
    mensaje += `ID: ${c.id}\nNombre: ${c.nombre} ${c.apellido}\nDNI: ${c.dni}\n contacto: ${c.numeroContacto}\nCelular: ${c.dispositivoAReparar}\nReparación: ${c.reparacion}\nCosto: $${c.costo}\nEstado: ${c.estado}\n\n`;
  });

  alert(mensaje);
}

const estadoDeReparacion = (id, estado) =>{
  let index = buscadorPorID(id)

  registroDeClientes[index].setEstado(estado)
}

function cierreDeCaja() {
  if (registroDeClientes.length === 0) {
    alert("Aún no hay dinero registrado.");
    return;
  }
  let caja = 0;

  registroDeClientes.forEach((cliente) => {
    caja += Number(cliente.costo);
  });

  alert("Total recaudado en la caja: $" + caja);
}

for (let i = 0; i < 3; i++) {
  let usuario = prompt("Ingrese nombre de usuario");
  let password = prompt("Ingrese contraseña");

  logeo = login(usuario, password);
  if (logeo) {
    let salir = false;

    while (!salir) {
      let menu = Number(
        prompt(
          "Sistema de Gestion de Clientes\n" +
            "1 - Agregar cliente\n" +
            "2 - Ver lista de clientes\n" +
            "3 - Total de ingresos\n" +
            "4 - Estado de la Reparacion\n" +
            "0 - Salir"
        )
      );

      switch (menu) {
        case 1:
          let nombre = prompt("Nombre del cliente:");
          let apellido = prompt("Apellido del cliente:");
          let dni = Number(prompt("DNI del cliente:"));
          let Contacto = Number(prompt("Numero de contacto"));
          let dispositivo = prompt("dispositivo a reparar:");
          let reparacion = prompt("Reparación a realizar:");
          let costo = Number(prompt("Costo de la reparación:"));
          agregarCliente(
            nombre,
            apellido,
            dni,
            Contacto,
            dispositivo,
            reparacion,
            costo
          );
          break;

        case 2:
          verClientes();
          break;

        case 3:
          cierreDeCaja();
          break; 
        
        case 4:
          let idBuscado = Number(prompt("Ingrese ID del cliente:"));
          let nuevoEstado = prompt("Ingrese el nuevo estado de la reparación:");
          estadoDeReparacion(idBuscado, nuevoEstado);
          break;


        case 0:
          alert("Saliendo del sistema. ¡Hasta luego!");
          salir = true;
          break;

        default:
          alert("Opción inválida.");
      }
    }

    break;
  }
}

if (!logeo) {
  alert("Cuenta bloqueada por demasiados intentos fallidos.");
}
