const express = require('express');
const router  = express.Router();
const conn = require('../../db/index');
const mysql = require('mysql')

router.get('/',(req,res)=>{
    let sql = "SELECT * FROM st_payment_receive_given_info ";
    conn.query(sql,(err,results,fields)=>{
        if(err){
            return res.status(501).json({message:"error occured on our side ",error:err});
        }else{  
         let payment_receive_given =  results.map(row=>({...row}));
            return res.json({payment_receive_given})        
        }
    })
})

// add one payment_receipt_gievn
router.post('/',(req,res)=>{
    let {payment_receipt_gievn} = req.body;
    if(!payment_receipt_gievn){
        return res.status(406).json({err:"provide payment_receipt_gievn details"});
    }
    let columns = Object.keys(payment_receipt_gievn);
    let col = columns.join(',');
    console.log(columns);
    let query = "INSERT INTO st_payment_receipt_gievn_info("+columns+") VALUES";
    let values = Object.values(payment_receipt_gievn);
    let qs = columns.map((t)=>"?").join(',');
    query+="("+qs+")";
    conn.query(query,values,(err,results,fields)=>{
        if(err){
            console.log(err);
        }else{
            console.log(results);
        }
    })
    return res.json({msg:"add one payment_receipt_gievn"})
})

router.get('/:id',(req,res)=>{
    const {id} = req.params;

    let sql = "SELECT * FROM st_payment_receipt_gievn_info WHERE id=?";
    conn.query(sql,[id],(err,results,fields)=>{
        if(err){
            console.log(err);
            return res.status(404).send("payment_receipt_gievn not found");
        }else{
         let payment_receipt_gievn =  results.map(row=>({...row}));
            return res.json({payment_receipt_gievn})        
        }
    })
})


router.patch('/:id',(req,res)=>{
    const { id } = req.params;
    const { payment_receipt_gievn } = req.body;
    if(!payment_receipt_gievn){
        return res.status(406).send("details not provided ");
    }
    let query = "UPDATE st_payment_receipt_gievn_info SET ";
    let values = [];
    Object.entries(payment_receipt_gievn).forEach((update) => {
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
    let sql = "DELETE from st_payment_receipt_gievn_info WHERE id=? ";
    conn.query(sql, [id], (err, results, fields) => {
      console.log(results);
      return res.status(200).json({message:"done"});
    });
})

module.exports = router;







