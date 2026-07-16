const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

const DB_SQLITE_PATH = path.join(__dirname, 'database', 'database.sqlite');

async function alterTable() {
    try {
        const db = await open({
            filename: DB_SQLITE_PATH,
            driver: sqlite3.Database
        });

        // Agregamos la columna 'cerrada'
        await db.exec(`
            ALTER TABLE ordenes ADD COLUMN cerrada INTEGER DEFAULT 0;
        `);
        console.log('Columna cerrada agregada a ordenes.');

        await db.close();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

alterTable();
