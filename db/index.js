const mysql = require('mysql');
const connection  = mysql.createPool({
    connectionLimit:50,
    host:'localhost',
    user:'tech18',
    password:'password',
    database:'bricks_soft'
  })
connection.on('connection',()=>{
  console.log('connected to db');
})

module.exports=connection;