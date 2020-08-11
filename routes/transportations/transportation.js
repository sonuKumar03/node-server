const express = require('express');
const router  = express.Router();
const conn = require('../../db/index');
const mysql = require('mysql')


router.post('/types',(req,res)=>{
    let {sales_transportation} = req.body;
    if(!sales_transportation){
        return res.status(406).json({err:"provide sales_transportation type details"});
    }
    let columns = Object.keys(sales_transportation);
    let col = columns.join(',');
    console.log(columns);
    let query = "INSERT INTO st_sales_transportation_type("+columns+") VALUES";
    let values = Object.values(sales_transportation);
    let qs = columns.map((t)=>"?").join(',');
    query+="("+qs+")";
    conn.query(query,values,(err,results,fields)=>{
        if(err){
            console.log(err);
        }else{
            console.log(results);
        }
    })
    return res.json({msg:"add one sales_transportation"})
})
router.get('/',(req,res)=>{
    let sql = "SELECT * FROM st_sales_transportation_info ";
    conn.query(sql,(err,results,fields)=>{
        if(err){
            return res.status(501).json({message:"error occured on our side "});
        }else{  
         let sales_transportations =  results.map(row=>({...row}));
            return res.json({sales_transportations})        
        }
    })
})

// add one sales_transportation
router.post('/',(req,res)=>{
    let {sales_transportation} = req.body;
    if(!sales_transportation){
        return res.status(406).json({err:"provide sales_transportation details"});
    }
    let columns = Object.keys(sales_transportation);
    let col = columns.join(',');
    console.log(columns);
    let query = "INSERT INTO st_sales_transportation_info("+columns+") VALUES";
    let values = Object.values(sales_transportation);
    let qs = columns.map((t)=>"?").join(',');
    query+="("+qs+")";
    conn.query(query,values,(err,results,fields)=>{
        if(err){
            console.log(err);
        }else{
            console.log(results);
        }
    })
    return res.json({msg:"add one sales_transportation"})
})

router.get('/:id',(req,res)=>{
    const {id} = req.params;

    let sql = "SELECT * FROM st_sales_transportation_info WHERE id=?";
    conn.query(sql,[id],(err,results,fields)=>{
        if(err){
            console.log(err);
            return res.status(404).send("sales_transportation not found");
        }else{
         let sales_transportation =  results.map(row=>({...row}));
            return res.json({sales_transportation})        
        }
    })
})


router.patch('/:id',(req,res)=>{
    const { id } = req.params;
    const { sales_transportation } = req.body;
    if(!sales_transportation){
        return res.status(406).send("details not provided ");
    }
    let query = "UPDATE st_sales_transportation_info SET ";
    let values = [];
    Object.entries(sales_transportation).forEach((update) => {
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
          return res.json({ err });
        }
        return res.json({ results });
      });
    }
})

router.delete('/:id',(req,res)=>{
    const { id } = req.params;
    if (!id) {
      return res.status(404).json({message: "id is required" });
    }
    let sql = "DELETE from st_sales_transportation_info WHERE id=? ";
    conn.query(sql, [id], (err, results, fields) => {
      console.log(results);
      return res.status(200).json({message:"done"});
    });
})

module.exports = router;







