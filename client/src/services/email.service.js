
const EMAILJS_SERVICE_ID = "service_lolzt1m";
const EMAILJS_TEMPLATE_ID = "template_ji8m999";
/**
 * Send purchase confirmation email to client.
 * @param {Object} orden   - Created order object
 * @param {string} email   - Client email
 * @param {string} nombre  - Client full name
 * @returns {Promise<void>}
 */
export async function enviarCorreoConfirmacion(orden, email, nombre) {
  // Build plain text product list
  const productosList = orden.productos
    .map(p =>
      `• ${p.nombre} (Talla: ${p.talla} | Color: ${p.color}) x${p.cantidad} = $${(p.precioUnitario * p.cantidad).toLocaleString("es-CO")}`
    )
    .join("\n");

  const templateParams = {
    to_email: email,
    to_name: nombre,
    order_id: orden.id ?? "---",
    order_date: new Date(orden.fecha).toLocaleDateString("es-CO", {
      day: "2-digit", month: "long", year: "numeric"
    }),
    order_total: `$${orden.total.toLocaleString("es-CO")}`,
    payment_method: orden.metodoPago,
    shipping_address: orden.direccionEnvio,
    products_list: productosList,
    store_name: "SportZone"
  };

  // Check if EmailJS is available
  if (typeof emailjs === "undefined") {
    console.warn("EmailJS no está disponible. Verifica que el SDK esté cargado en index.html.");
    return;
  }

  console.log("SERVICE:", EMAILJS_SERVICE_ID);
  console.log("TEMPLATE:", EMAILJS_TEMPLATE_ID);

  console.log({
    service: EMAILJS_SERVICE_ID,
    template: EMAILJS_TEMPLATE_ID,
    params: templateParams
  });

  console.log({
    service: EMAILJS_SERVICE_ID,
    template: EMAILJS_TEMPLATE_ID,
  });


  try {
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log("Correo enviado", response);
  } catch (error) {
    console.error(error);
    console.log(error.status);
    console.log(error.text);
  }
}