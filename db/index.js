const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();
const connection  = mysql.createPool({
    connectionLimit:50,
    host:process.env.HOST,
    user:process.env.USER,
    password:process.env.PASSWORD,
    database:process.env.DB_NAME
  })
connection.on('connection',()=>{
  console.log('connected to db');
})

module.exports=connection;