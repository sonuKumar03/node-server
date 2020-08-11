const express = require('express');
const router  = express.Router();
const conn = require('../../db/index');
const mysql = require('mysql')

router.get('/',(req,res)=>{
    let sql = "SELECT * FROM st_admin ";
    conn.query(sql,(err,results,fields)=>{
        if(err){
            return res.status(501).json({
                error:"some error occured at our side"
            });
        }else{  
         let admin =  results.map(row=>({...row}));
            return res.json({admin})        
        }
    })
})
// add one admin
router.post('/',(req,res)=>{
    let {admin} = req.body;
    if(!admin){
        return res.status(422).json({err:"provide admin details"});
    }
    let columns = Object.keys(admin);
    let col = columns.join(',');
    console.log(columns);
    let query = "INSERT INTO st_admin("+columns+") VALUES";
    let values = Object.values(admin);
    let qs = columns.map((t)=>"?").join(',');
    query+="("+qs+")";
    conn.query(query,values,(err,results,fields)=>{
        if(err){
            return res.status(501).json({
                error:"some error occured at our side"
            });
        }else{
            console.log(results);
        }
    })
    return res.json({message:"admin sdded"})
})

router.get('/:id',(req,res)=>{
    const {id} = req.params;

    let sql = "SELECT * FROM st_admin WHERE id=?";
    conn.query(sql,[id],(err,results,fields)=>{
        if(err){
            console.log(err);
            return res.status(404).json({code:404,error:"admin not found"});
        }else{
         let admin =  results.map(row=>({...row}));
            return res.status(200).json({admin})        
        }
    })
})


router.patch('/:id',(req,res)=>{
    const { id } = req.params;
    const { admin } = req.body;
    if(!admin){
        return res.status(422).json({errr:"details not provided "});
    }
    let query = "UPDATE st_admin SET ";
    let values = [];
    Object.entries(admin).forEach((update) => {
      query += `${update[0]}=?,`;
      values.push(update[1]);
    });
    let index = query.lastIndexOf(",");
    let q = query.substring(0, index) + query.substring(index + 1, query.length);
    values.push(id);
    q += ` WHERE id=? `;
    let sql_query = mysql.format(q, values);
    if (sql_query.length > 1) {
      conn.query(sql_query, (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.status(501).json({ err });
        }
        return res.json({ results });
      });
    }
})
router.delete('/:id',(req,res)=>{
    const { id } = req.params;
    if (!id) {
      return res.send(404).json({ err: "id is required" });
    }
    let sql = "DELETE from st_admin WHERE id=? ";
    conn.query(sql, [id], (err, results, fields) => {
      console.log(results);
      return res.status(200).json({
          message:"done"
      })
    });
})
module.exports = router;







