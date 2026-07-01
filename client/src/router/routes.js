import { renderHome, setupHome } from "../views/home.js";
import { renderLogin, setupLogin } from "../views/auth/login.js";
import { renderRegister, setupRegister } from "../views/auth/register.js";
import { renderNotFound } from "../views/auth/not-found.js";
import { renderCatalogo, setupCatalogo } from "../views/productos/catalogo.js";
import { renderDetalle, setupDetalle } from "../views/productos/detalle.js";
import { renderCart, setupCart } from "../views/checkout/cart-view.js";
import { renderCheckout, setupCheckout } from "../views/checkout/checkout.js";
import { renderDashboard, setupDashboard } from "../views/users/dashboard.js";
import { renderAdmin, setupAdmin } from "../views/users/admin.js";
import { renderProductoForm, setupProductoForm } from "../views/productos/producto-form.js";
import { renderProfile, setupProfile } from "../views/users/profile.js";

const routes = {
  "/": {
    render: renderHome,
    setup: setupHome,
  },
  "/login": {
    render: renderLogin,
    setup: setupLogin,
  },
  "/register": {
    render: renderRegister,
    setup: setupRegister,
  },
  "/productos": {
    render: renderCatalogo,
    setup: setupCatalogo,
  },
  "/producto/:id": {
    render: renderDetalle,
    setup: setupDetalle,
  },
  "/carrito": {
    render: renderCart,
    setup: setupCart,
  },
  "/checkout": {
    render: renderCheckout,
    setup: setupCheckout,
    protected: true,
  },
  "/dashboard": {
    render: renderDashboard,
    setup: setupDashboard,
    protected: true,
  },
  "/profile": {
    render: renderProfile,
    setup: setupProfile,
    protected: true,
  },
  "/admin": {
    render: renderAdmin,
    setup: setupAdmin,
    protected: true,
    adminOnly: true,
  },
  "/admin-producto-form": {
    render: renderProductoForm,
    setup: setupProductoForm,
    protected: true,
    adminOnly: true,
  },
  "/notFound": {
    render: renderNotFound,
  }
};

export default routes;
