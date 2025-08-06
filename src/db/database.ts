import Database from "better-sqlite3";


const db = new Database('database.sqlite', {verbose: console.log,});

db.exec(`
CREATE TABLE IF NOT EXISTS users ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,     
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

export default db;