const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

const DB_JSON_PATH = path.join(__dirname, 'database', 'db.json');
const DB_SQLITE_PATH = path.join(__dirname, 'database', 'database.sqlite');

async function migrate() {
    try {
        // 1. Open SQLite connection
        const db = await open({
            filename: DB_SQLITE_PATH,
            driver: sqlite3.Database
        });

        console.log('Conexión exitosa a SQLite.');

        // 2. Create tables
        await db.exec(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                lastName TEXT,
                email TEXT UNIQUE,
                password TEXT,
                role TEXT
            );

            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT,
                descripcion TEXT,
                categoria TEXT,
                precio INTEGER,
                stock INTEGER,
                tallas TEXT,
                colores TEXT,
                imagen TEXT
            );

            CREATE TABLE IF NOT EXISTS ordenes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                fecha TEXT,
                estado TEXT,
                total INTEGER,
                productos TEXT,
                cerrada INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS cierres (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha TEXT,
                total_ingresos INTEGER,
                total_ordenes INTEGER
            );
        `);

        console.log('Tablas creadas correctamente.');

        // 3. Read JSON data
        const rawData = fs.readFileSync(DB_JSON_PATH, 'utf8');
        const data = JSON.parse(rawData);

        // 4. Clear tables
        await db.exec(`
            DELETE FROM usuarios;
            DELETE FROM productos;
            DELETE FROM ordenes;
            DELETE FROM cierres;
        `);

        // 5. Insert Users
        if (data.users && data.users.length > 0) {
            for (const user of data.users) {
                await db.run(
                    `INSERT INTO usuarios (id, name, lastName, email, password, role) VALUES (?, ?, ?, ?, ?, ?)`,
                    [
                        user.id,
                        user.name,
                        user.lastName,
                        user.email,
                        user.password,
                        JSON.stringify(user.role || [])
                    ]
                );
            }
            console.log(`Se insertaron ${data.users.length} usuarios.`);
        }

        // 6. Insert Products
        if (data.productos && data.productos.length > 0) {
            for (const prod of data.productos) {
                await db.run(
                    `INSERT INTO productos (id, nombre, descripcion, categoria, precio, stock, tallas, colores, imagen) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        prod.id,
                        prod.nombre,
                        prod.descripcion,
                        prod.categoria,
                        prod.precio,
                        prod.stock,
                        JSON.stringify(prod.tallas || []),
                        JSON.stringify(prod.colores || []),
                        prod.imagen
                    ]
                );
            }
            console.log(`Se insertaron ${data.productos.length} productos.`);
        }

        // 7. Insert Orders
        if (data.ordenes && data.ordenes.length > 0) {
            for (const ord of data.ordenes) {
                await db.run(
                    `INSERT INTO ordenes (id, userId, fecha, estado, total, productos, cerrada) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [
                        ord.id,
                        ord.userId,
                        ord.fecha,
                        ord.estado,
                        ord.total,
                        JSON.stringify(ord.productos || []),
                        0
                    ]
                );
            }
            console.log(`Se insertaron ${data.ordenes.length} órdenes.`);
        }

        console.log('¡Migración completada exitosamente! Ya puedes usar database.sqlite');
        await db.close();

    } catch (error) {
        console.error('Error durante la migración:', error);
    }
}

migrate();
