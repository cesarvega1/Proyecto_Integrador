// Manejo del carrito de compras local en LocalStorage

export function obtenerCarrito() {
  const cart = localStorage.getItem("carrito");
  return cart ? JSON.parse(cart) : [];
}

export function guardarCarrito(carrito) {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  // Dispara un evento personalizado para actualizar contadores flotantes si los hay
  window.dispatchEvent(new Event("cart-updated"));
}

export function agregarAlCarrito(producto, talla, color, cantidad = 1) {
  const carrito = obtenerCarrito();
  
  // Buscar si ya existe la misma prenda con la misma talla y el mismo color
  const index = carrito.findIndex(
    (item) => item.id === producto.id && item.talla === talla && item.color === color
  );

  if (index !== -1) {
    carrito[index].cantidad += cantidad;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      talla,
      color,
      cantidad,
      stockMaximo: producto.stock
    });
  }

  guardarCarrito(carrito);
}

export function eliminarDelCarrito(id, talla, color) {
  let carrito = obtenerCarrito();
  carrito = carrito.filter((item) => !(item.id === id && item.talla === talla && item.color === color));
  guardarCarrito(carrito);
}

export function actualizarCantidad(id, talla, color, cantidad) {
  const carrito = obtenerCarrito();
  const index = carrito.findIndex(
    (item) => item.id === id && item.talla === talla && item.color === color
  );

  if (index !== -1) {
    carrito[index].cantidad = Math.max(1, Math.min(cantidad, carrito[index].stockMaximo));
    guardarCarrito(carrito);
  }
}

export function vaciarCarrito() {
  guardarCarrito([]);
}

export function obtenerTotalCarrito() {
  const carrito = obtenerCarrito();
  return carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
}

export function obtenerCantidadTotal() {
  const carrito = obtenerCarrito();
  return carrito.reduce((sum, item) => sum + item.cantidad, 0);
}
