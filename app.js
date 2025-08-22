// BUSCADOR
const btnBuscar = document.getElementById("btnBuscar");
const buscador = document.getElementById("buscador");
btnBuscar.addEventListener("click", () => {
  buscador.style.display =
    buscador.style.display === "block" ? "none" : "block";
});

// CARRITO
const btnCarrito = document.getElementById("btnCarrito");
const carritoModal = document.getElementById("carritoModal");
const listaCarrito = document.getElementById("listaCarrito");

let carrito = [];

btnCarrito.addEventListener("click", () => {
  listaCarrito.innerHTML = carrito.length
    ? carrito.map((p) => `<li>${p}</li>`).join("")
    : "<li>Carrito vacío</li>";
  carritoModal.style.display = "flex";
});

function cerrarCarrito() {
  carritoModal.style.display = "none";
}

