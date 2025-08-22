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

 // Carrusel
// (Eliminado el bloque duplicado para evitar la redeclaración de variables)

    // Botón Info
    document.querySelectorAll(".info").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const info = e.target.parentElement.getAttribute("data-info");
        alert(info);
      });
    });


    // Popup carrito
const botonesCarrito = document.querySelectorAll(".btn-carrito");
const popup = document.getElementById("cart-popup");

botonesCarrito.forEach(boton => {
  boton.addEventListener("click", () => {
    const producto = boton.parentElement.querySelector(".card-title").innerText;
    popup.innerText = `✅ ${producto} agregado al carrito`;
    
    popup.classList.add("show");
    setTimeout(() => {
      popup.classList.remove("show");
    }, 2000);
  });
});

// Carrusel
let index = 0;
const imagenes = document.getElementById("imagenes");
const total = imagenes.children.length;

function mostrarImagen() {
  imagenes.style.transform = `translateX(${-index * 80}vw)`;
}

function siguiente() {
  index = (index + 1) % total;
  mostrarImagen();
}

function anterior() {
  index = (index - 1 + total) % total;
  mostrarImagen();
}

// Botón Info galería
document.querySelectorAll(".info").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const info = e.target.parentElement.getAttribute("data-info");
    alert(info);
  });
});
