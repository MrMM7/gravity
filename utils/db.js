const sqlite = require("node:sqlite");

const db = new sqlite.DatabaseSync(`${__dirname}/../db.sqlite`)

db.exec(`
    CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short_code TEXT NOT NULL UNIQUE,
        original_url TEXT NOT NULL
    )
`);

module.exports = db;