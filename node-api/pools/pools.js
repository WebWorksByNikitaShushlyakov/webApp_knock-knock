const mysql = require("mysql2");

const Root_pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "db_platform_knock-knock",
    password: "root"
})

const User_pool= mysql.createPool({
    host: "localhost",
    user: "authorized_user",
    database: "db_platform_knock-knock",
    password: "authuser"
})

const Base_pool= mysql.createPool({
    host: "localhost",
    user: "unauthorized_user",
    database: "db_platform_knock-knock",
    password: "unauthuser"
})

exports.Root_pool=Root_pool
exports.User_pool=User_pool
exports.Base_pool=Base_pool


