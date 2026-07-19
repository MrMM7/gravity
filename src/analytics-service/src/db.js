const sqlite = require("node:sqlite");

const db = new sqlite.DatabaseSync(`${__dirname}/../db.sqlite`)

// due to the limitations of SQLite we can't store an array of ip addresses, instead we just count the total clicks
db.exec(`
    CREATE TABLE IF NOT EXISTS link_analytics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        link_id TEXT NOT NULL,
        clicks INTEGER DEFAULT 0
    )
`);

module.exports = db;