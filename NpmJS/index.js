// const FSDB = require("file-system-db");

// const db = new FSDB();

var db = openDatabase('main', '1.0', 'main.db', 2 * 1024 * 1024);


function getDb() {
    return db;
}