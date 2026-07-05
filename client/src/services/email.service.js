/**
 * email.service.js
 * Servicio de envío de correos de confirmación via EmailJS.
 *
 * CONFIGURACIÓN REQUERIDA:
 * 1. Crea una cuenta gratis en https://www.emailjs.com
 * 2. Ve a "Email Services" → Agrega Gmail u otro proveedor
 * 3. Ve a "Email Templates" → Crea una plantilla con estas variables:
 *      {{to_email}}       - Email del cliente
 *      {{to_name}}        - Nombre del cliente
 *      {{order_id}}       - ID del pedido
 *      {{order_date}}     - Fecha del pedido
 *      {{order_total}}    - Total de la compra
 *      {{payment_method}} - Método de pago
 *      {{shipping_address}} - Dirección de envío
 *      {{products_list}}  - Lista de productos
 *      {{store_name}}     - Nombre de la tienda
 * 4. Reemplaza los valores de abajo con los tuyos.
 * 5. En index.html reemplaza "TU_PUBLIC_KEY_AQUI" con tu Public Key.
 */

const EMAILJS_SERVICE_ID = "service_lolzt1m";
const EMAILJS_TEMPLATE_ID = "template_ji8m999";
/**
 * Envía un correo de confirmación de compra al cliente.
 * @param {Object} orden   - Objeto de orden creado
 * @param {string} email   - Correo electrónico del cliente
 * @param {string} nombre  - Nombre completo del cliente
 * @returns {Promise<void>}
 */
export async function enviarCorreoConfirmacion(orden, email, nombre) {
  // Construir lista de productos en texto plano
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
    store_name: "SportZone ⚡"
  };

  // Verificar que la librería EmailJS esté disponible
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

    console.log("✅ Correo enviado", response);
  } catch (error) {
    console.error(error);
    console.log(error.status);
    console.log(error.text);
  }
}