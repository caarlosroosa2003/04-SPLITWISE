class Usuario {
    constructor(nombre, pathImg) {
        this.nombre = nombre;
        this.gastos = []; // Array para almacenar los gastos realizados por el usuario
        this.pathImg = pathImg;
        this.totalPagado = 0; // Suma total de todos los gastos realizados
    }

    // Método para agregar un gasto a este usuario
    agregarGasto(titulo, monto, fecha) {
        const nuevoGasto = new Gasto(titulo, monto, fecha);
        this.gastos.push(nuevoGasto);
        this.totalPagado += parseFloat(monto); // Sumar el monto al total pagado
    }

    // Método para calcular el saldo (cuánto debe o cuánto le deben)
    calcularSaldo(totalGrupo, numUsuarios) {
        const cuotaPorPersona = totalGrupo / numUsuarios; // Lo que cada persona debería pagar
        const saldo = this.totalPagado - cuotaPorPersona; // Si es positivo, le deben; si es negativo, debe
        return saldo;
    }
}

class Gasto {
  constructor(titulo, monto, fecha) {
    this.titulo = titulo;
    this.monto = parseFloat(monto); // Convertir a número
    this.fecha = fecha;
  }
}

// Usuarios predefinidos
const usuarios = [
  new Usuario("Juan", "img/usuarios/avatar_a.png"),
  new Usuario("Pedro", "img/usuarios/avatar_b.png"),
  new Usuario("María", "img/usuarios/avatar_c.png"),
];

// Obtener referencias al DOM
const form = document.querySelector("form");
const resumenDiv = document.getElementById("collapseOne"); // Resumen de gastos
const cuentasDiv = document.getElementById("collapseThree"); // Pestaña de cuentas

// Manejo del formulario
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const nombreUsuario = document.querySelector("#userSelect").value;
  const titulo = document.getElementById("title").value;
  const monto = document.getElementById("amount").value;
  const fecha = document.getElementById("date").value;

  if (!nombreUsuario || !titulo || !monto || !fecha) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  // Buscar al usuario seleccionado
  const usuario = usuarios.find((u) => u.nombre === nombreUsuario);
  if (usuario) {
    // Agregar el gasto al usuario
    usuario.agregarGasto(titulo, monto, fecha);

    // Actualizar el resumen de gastos
    actualizarResumen(usuario, titulo, monto, fecha);

    // Actualizar la pestaña de cuentas
    actualizarCuentas();
  }

  // Limpiar el formulario
  form.reset();
});

// Función para actualizar el resumen visualmente
function actualizarResumen(usuario, titulo, monto, fecha) {
  const divGasto = document.createElement("div");
  divGasto.classList.add("card", "mb-12", "espacio");

  divGasto.innerHTML = `
        <div class="row g-0">
            <div class="col-md-2">
                <img src="${usuario.pathImg}" class="img-fluid rounded-start">
            </div>
            <div class="col-md-10">
                <div class="card-body">
                    <h5 class="card-title">${usuario.nombre}</h5>
                    <p class="card-text">Pagó ${monto}€ el ${fecha}.</p>
                </div>
            </div>
        </div>
    `;

  resumenDiv.appendChild(divGasto);
}

// Actualizar la sección de "Cuentas" después de añadir un gasto
function actualizarCuentas() {
  cuentasDiv.innerHTML = ""; // Limpiar la sección de cuentas

  // Sumar todos los gastos del grupo
  let totalGrupo = 0;
  usuarios.forEach((usuario) => {
    totalGrupo += usuario.totalPagado;
  });

  // Número de usuarios
  const numUsuarios = usuarios.length;

  // Mostrar la cuenta de cada usuario
  usuarios.forEach((usuario) => {
    const saldo = usuario.calcularSaldo(totalGrupo, numUsuarios);

    const divCuenta = document.createElement("div");
    divCuenta.classList.add("card", "mb-12", "espacio");

    divCuenta.innerHTML = `
            <div class="row g-0">
                <div class="col-md-2">
                    <img src="${
                      usuario.pathImg
                    }" class="img-fluid rounded-start">
                </div>
                <div class="col-md-10">
                    <div class="card-body">
                        <h5 class="card-title">${usuario.nombre}</h5>
                        <p class="card-text">
                            Ha pagado ${usuario.totalPagado.toFixed(2)}€. 
                            ${
                              saldo > 0
                                ? `Se le debe ${saldo.toFixed(2)}€.`
                                : `Debe ${Math.abs(saldo).toFixed(2)}€.`
                            }
                        </p>
                    </div>
                </div>
            </div>
        `;

    cuentasDiv.appendChild(divCuenta);
  });
}
