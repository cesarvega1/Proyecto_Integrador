# SportZone

**Welcome!** This document is for students. The goal is to understand the project. We will see the structure, the technologies, and how Frontend and Backend connect. This is an e-commerce project called **SportZone**.

---

## General Architecture

The project uses a **Client-Server** architecture:

1. **Frontend (Client):** The code that runs in the web browser. It shows the User Interface (UI), handles clicks, and talks to the server.
2. **Backend (Server):** An app that runs in the background. It answers the client (saves a user, makes an order, gets a product).
3. **Database:** A safe place to keep information permanently (products, users, orders).

---

## 1. Frontend (The graphical interface)

The frontend is in the `/client` folder.

### Used Technologies
* **HTML5, CSS3, Vanilla JavaScript:** We use basic web language (no heavy frameworks like React or Angular). This is great to learn the Document Object Model (DOM) and routing.
* **Tailwind CSS:** A design framework with "utility classes". We do not write long `.css` files. We put classes in the HTML (for example, `bg-red-500` for red background).
* **Vite:** It is the "bundler". It takes all `.js` and `.css` files, makes them small, and starts a fast local server (when you run `npm run dev`).

### Folder Structure (`/client/src/`)
* `/components/`: Parts of the interface that we reuse, like the navigation menu (`navbar.js`) or the footer (`footer.js`).
* `/router/`: The code to change the "page" (for example, go from Home to Catalog) without reloading the browser. This is called a **Single Page Application (SPA)**.
* `/services/`: The functions to make network requests (`fetch()`) to the backend. We have services for login (`auth.service.js`), products (`product.service.js`), orders, and emails.
* `/views/`: The full pages of the store. For example, `home.js` (start), product views (`catalogo.js`, `detalle.js`), cart views, and user panels (`dashboard.js`, `admin.js`).
* `/utils/`: Help functions, like the shopping cart (`cart.js`) and dark mode (`theme.js`).

> **TIP: The Render Pattern**  
> In this project, every view or component exports a function (e.g., `renderCatalogo()`). This returns a big string with HTML code. Then, this HTML goes dynamically into the main document (`index.html`).

---

## 2. Backend (The API server)

The backend is in the `/backend` folder. It provides a **REST API**. This means it uses HTTP routes to create, read, update, or delete data.

### Used Technologies
* **Node.js:** The environment to run JavaScript code outside the browser (on the server).
* **Express.js:** A light framework for Node.js. It helps to make the web server and define routes (for example, `app.get('/users')`).
* **CORS:** A middleware. It lets your Frontend (on port 5173) talk to your Backend (on port 3001). The browser does not block it.

### Main Files
* **`index.js`**: The heart of the backend! Here the Express server starts on port 3001. It has the routes for:
  * **Users:** `/users` (Register, login, edit profile).
  * **Products:** `/productos` (See catalog, create, update, or delete items, reduce stock).
  * **Orders:** `/ordenes` (Create new orders, change shipping status).
  * **Cash Closures:** `/cierres` (Admin logic to count sales of the day).
* **`migrate.js`**: A useful script. It takes initial data (from a `.json` file) and creates the tables. The database starts with pre-loaded information.

---

## 3. Database (Persistence)

### Used Technology
* **SQLite (sqlite3):** A relational database (SQL). It does not need an external server (like MySQL or PostgreSQL). It saves all the information in one file inside the project (`/backend/database/database.sqlite`).

### Relational Model (Main Tables)
The database has 4 main tables:
1. **`usuarios`**: Saves ID, name, last name, email (must be unique), password, and role (USER or ADMIN).
2. **`productos`**: Saves all data of the clothes or accessories: name, price, current stock, available sizes and colors (saved as a *string* in JSON format), and an image link.
3. **`ordenes`**: When a user buys, it saves their ID (`userId`), date, status ("Confirmed", "Sent", etc.), total cost, and the details of the clothes bought.
4. **`cierres`**: An admin table to save the accounting at the end of the day.

> **WARNING: Stock Management**  
> When a client finishes a purchase in the frontend, the backend checks (in a "Transaction") that there is enough stock of the product. If everything is correct, it subtracts the bought quantity from the `stock` in the `productos` table and saves the order.

---

## How do both parts connect? (A real life example)

Let's trace what happens when you enter the main page and open the Catalog:

1. **Client:** You click on "Go to Catalog".
2. **Frontend (Router):** JavaScript catches the click, changes the URL to `/productos` without reloading, and runs the function `setupCatalogo()`.
3. **Frontend (Service):** The catalog view calls `obtenerProductos()`. This function uses `fetch('http://localhost:3001/productos')` to talk to the backend.
4. **Backend (Express):** Express listens to the request on port 3001. It goes to the route `app.get('/productos', ...)`.
5. **Database:** The backend runs SQL code: `SELECT * FROM productos`. It gets the data from the SQLite file and changes it to JSON format (JavaScript Object Notation).
6. **Backend (Response):** It sends the array of JSON products back to the client (`res.json(productos)`).
7. **Frontend (Render):** The function in the client receives this data. It uses a `.map()` to build the HTML for each product card. Finally, it prints the cards on the screen.

---

## Important concepts for students

* **SPA (Single Page Application):** You will learn to simulate navigation between pages using JavaScript.
* **RESTful APIs:** You will understand the HTTP verbs convention (`GET` to read, `POST` to create, `PATCH/PUT` to edit, `DELETE` to delete).
* **Local Storage:** We use `sessionStorage` and `localStorage` in the frontend to remember the shopping cart or if the user logged in, even if they close the tab.
* **Responsive Design:** You will see in Tailwind CSS that we use prefixes like `md:` or `lg:` to make the store look good on phones and big screens.
* **Dynamic SQL Queries:** You will see how in the Backend, data (like arrays) must be saved as plain text (`JSON.stringify()`) and then recovered and converted back to an array (`JSON.parse()`) in SQLite.
