let admin = "admin";
let pass = 1234;
let logeo = false;
const registroDeClientes = [];

function creadoraDeIdAleatorio() {
  return Math.floor(Math.random() * 900000) + 100000;
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

function agregarCliente(
  nombre,
  apellido,
  dni,
  numeroContacto,
  celularAReparar,
  reparacion,
  costo
) {
  let nuevoCliente = {
    id: creadoraDeIdAleatorio(),
    nombre,
    apellido,
    dni,
    numeroContacto,
    celularAReparar,
    reparacion,
    costo,
  };
  registroDeClientes.push(nuevoCliente);
}

function verClientes() {
  if (registroDeClientes.length === 0) {
    alert("Aún no hay clientes registrados.");
    return;
  }

  let mensaje = "Clientes registrados:\n\n";
  registroDeClientes.forEach((c) => {
    mensaje += `ID: ${c.id}\nNombre: ${c.nombre} ${c.apellido}\nDNI: ${c.dni}\n contacto: ${c.numeroContacto}\nCelular: ${c.celularAReparar}\nReparación: ${c.reparacion}\nCosto: $${c.costo}\n\n`;
  });

  alert(mensaje);
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
            "3 - Cierre de Caja\n" +
            "0 - Salir"
        )
      );

      switch (menu) {
        case 1:
          let nombre = prompt("Nombre del cliente:");
          let apellido = prompt("Apellido del cliente:");
          let dni = Number(prompt("DNI del cliente:"));
          let Contacto = Number(prompt("Numero de contacto"));
          let celular = prompt("Celular a reparar:");
          let reparacion = prompt("Reparación a realizar:");
          let costo = Number(prompt("Costo de la reparación:"));
          agregarCliente(
            nombre,
            apellido,
            dni,
            1 | Contacto,
            celular,
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
