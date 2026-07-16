const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const app = express();
const PORT = 3001;
const DB_SQLITE_PATH = path.join(__dirname, 'database', 'database.sqlite');

// Middleware
app.use(cors());
app.use(express.json());

let db;

// Inicializar la base de datos
async function initDB() {
    db = await open({
        filename: DB_SQLITE_PATH,
        driver: sqlite3.Database
    });
    console.log('Conectado a la base de datos SQLite.');
}

// Helper to parse JSON fields safely
const parseJSON = (field) => {
    try {
        return JSON.parse(field);
    } catch {
        return field;
    }
};

// ----------------------
// RUTAS DE USUARIOS
// ----------------------
app.get('/users', async (req, res) => {
    try {
        let query = 'SELECT * FROM usuarios';
        const params = [];
        
        if (req.query.email && req.query.password) {
            query += ' WHERE email = ? AND password = ?';
            params.push(req.query.email, req.query.password);
        } else if (req.query.email) {
            query += ' WHERE email = ?';
            params.push(req.query.email);
        }

        let users = await db.all(query, params);
        
        // Parse role fields
        users = users.map(u => ({ ...u, role: parseJSON(u.role) }));
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await db.get('SELECT * FROM usuarios WHERE id = ?', [req.params.id]);
        if (user) {
            user.role = parseJSON(user.role);
            res.json(user);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/users', async (req, res) => {
    try {
        const { name, lastName, email, password, role } = req.body;
        
        // Check if email exists
        const existing = await db.get('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existing) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const roleStr = JSON.stringify(role || ['USER']);
        
        const result = await db.run(
            'INSERT INTO usuarios (name, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [name, lastName, email, password, roleStr]
        );
        
        res.status(201).json({ id: result.lastID, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/users/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = [];
        const params = [];
        
        for (const [key, value] of Object.entries(req.body)) {
            updates.push(`${key} = ?`);
            params.push(key === 'role' ? JSON.stringify(value) : value);
        }
        
        if (updates.length === 0) return res.json(await db.get('SELECT * FROM usuarios WHERE id = ?', [id]));
        
        params.push(id);
        await db.run(`UPDATE usuarios SET ${updates.join(', ')} WHERE id = ?`, params);
        
        const updatedUser = await db.get('SELECT * FROM usuarios WHERE id = ?', [id]);
        if (updatedUser) {
            updatedUser.role = parseJSON(updatedUser.role);
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ----------------------
// RUTAS DE PRODUCTOS
// ----------------------
app.get('/productos', async (req, res) => {
    try {
        let productos = await db.all('SELECT * FROM productos');
        productos = productos.map(p => ({
            ...p,
            tallas: parseJSON(p.tallas),
            colores: parseJSON(p.colores)
        }));
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/productos/:id', async (req, res) => {
    try {
        const producto = await db.get('SELECT * FROM productos WHERE id = ?', [req.params.id]);
        if (producto) {
            producto.tallas = parseJSON(producto.tallas);
            producto.colores = parseJSON(producto.colores);
            res.json(producto);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/productos', async (req, res) => {
    try {
        const { nombre, descripcion, categoria, precio, stock, tallas, colores, imagen } = req.body;
        const result = await db.run(
            'INSERT INTO productos (nombre, descripcion, categoria, precio, stock, tallas, colores, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                nombre, 
                descripcion, 
                categoria, 
                precio, 
                stock, 
                JSON.stringify(tallas || []), 
                JSON.stringify(colores || []), 
                imagen
            ]
        );
        res.status(201).json({ id: result.lastID, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/productos/:id', async (req, res) => {
    try {
        const { nombre, descripcion, categoria, precio, stock, tallas, colores, imagen } = req.body;
        await db.run(
            'UPDATE productos SET nombre=?, descripcion=?, categoria=?, precio=?, stock=?, tallas=?, colores=?, imagen=? WHERE id=?',
            [
                nombre, 
                descripcion, 
                categoria, 
                precio, 
                stock, 
                JSON.stringify(tallas || []), 
                JSON.stringify(colores || []), 
                imagen, 
                req.params.id
            ]
        );
        res.json({ id: parseInt(req.params.id), ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/productos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = [];
        const params = [];
        
        for (const [key, value] of Object.entries(req.body)) {
            updates.push(`${key} = ?`);
            params.push((key === 'tallas' || key === 'colores') ? JSON.stringify(value) : value);
        }
        
        if (updates.length > 0) {
            params.push(id);
            await db.run(`UPDATE productos SET ${updates.join(', ')} WHERE id = ?`, params);
        }
        
        const updated = await db.get('SELECT * FROM productos WHERE id = ?', [id]);
        if (updated) {
            updated.tallas = parseJSON(updated.tallas);
            updated.colores = parseJSON(updated.colores);
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/productos/:id', async (req, res) => {
    try {
        const result = await db.run('DELETE FROM productos WHERE id = ?', [req.params.id]);
        if (result.changes > 0) {
            res.json({ message: 'Producto eliminado' });
        } else {
            res.status(404).json({ message: 'Producto no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ----------------------
// RUTAS DE ÓRDENES
// ----------------------
app.get('/ordenes', async (req, res) => {
    try {
        let query = 'SELECT * FROM ordenes';
        const params = [];
        
        if (req.query.userId) {
            query += ' WHERE userId = ?';
            params.push(req.query.userId);
        }
        
        let ordenes = await db.all(query, params);
        ordenes = ordenes.map(o => ({
            ...o,
            productos: parseJSON(o.productos)
        }));
        res.json(ordenes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/ordenes', async (req, res) => {
    try {
        const { userId, fecha, estado, total, productos } = req.body;
        const result = await db.run(
            'INSERT INTO ordenes (userId, fecha, estado, total, productos) VALUES (?, ?, ?, ?, ?)',
            [userId, fecha, estado, total, JSON.stringify(productos || [])]
        );
        res.status(201).json({ id: result.lastID, ...req.body });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/ordenes/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = [];
        const params = [];
        
        for (const [key, value] of Object.entries(req.body)) {
            updates.push(`${key} = ?`);
            params.push(key === 'productos' ? JSON.stringify(value) : value);
        }
        
        if (updates.length > 0) {
            params.push(id);
            await db.run(`UPDATE ordenes SET ${updates.join(', ')} WHERE id = ?`, params);
        }
        
        const updated = await db.get('SELECT * FROM ordenes WHERE id = ?', [id]);
        if (updated) {
            updated.productos = parseJSON(updated.productos);
            res.json(updated);
        } else {
            res.status(404).json({ message: 'Orden no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ----------------------
// RUTAS DE CIERRES
// ----------------------
app.get('/cierres', async (req, res) => {
    try {
        const cierres = await db.all('SELECT * FROM cierres ORDER BY id ASC');
        res.json(cierres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/cierres', async (req, res) => {
    try {
        // 1. Obtener órdenes del día (o no cerradas)
        const ordenesNoCerradas = await db.all('SELECT * FROM ordenes WHERE cerrada = 0 OR cerrada IS NULL');
        
        if (ordenesNoCerradas.length === 0) {
            return res.status(400).json({ message: 'No hay órdenes pendientes por cerrar.' });
        }

        // 2. Calcular totales
        const total_ordenes = ordenesNoCerradas.length;
        const total_ingresos = ordenesNoCerradas.reduce((acc, ord) => acc + ord.total, 0);
        const fecha = new Date().toISOString();

        // 3. Guardar el cierre
        const result = await db.run(
            'INSERT INTO cierres (fecha, total_ingresos, total_ordenes) VALUES (?, ?, ?)',
            [fecha, total_ingresos, total_ordenes]
        );

        // 4. Marcar órdenes como cerradas
        await db.run('UPDATE ordenes SET cerrada = 1 WHERE cerrada = 0 OR cerrada IS NULL');

        res.status(201).json({
            id: result.lastID,
            fecha,
            total_ingresos,
            total_ordenes
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Arrancar el servidor
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor Express conectado a SQLite corriendo en el puerto ${PORT}`);
    });
}).catch(err => {
    console.error('No se pudo inicializar la base de datos:', err);
});
