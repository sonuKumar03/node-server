const express = require('express');
const router  = express.Router();
const conn = require('../../db/index');
const mysql = require('mysql')

router.get('/',(req,res)=>{
    let sql = "SELECT * FROM st_default_receipt_no ";
    conn.query(sql,(err,results,fields)=>{
        if(err){
            return res.status(501).send("error occured on our side ");
        }else{  
         let receipts =  results.map(row=>({...row}));
            return res.json({receipts})        
        }
    })
})

// add one receipt
router.post('/',(req,res)=>{
    let {receipt} = req.body;
    if(!receipt){
        return res.status(406).json({err:"provide receipt details"});
    }
    let columns = Object.keys(receipt);
    let col = columns.join(',');
    console.log(columns);
    let query = "INSERT INTO st_default_receipt_no("+columns+") VALUES";
    let values = Object.values(receipt);
    let qs = columns.map((t)=>"?").join(',');
    query+="("+qs+")";
    conn.query(query,values,(err,results,fields)=>{
        if(err){
            console.log(err);
        }else{
            console.log(results);
        }
    })
    return res.json({msg:"add one receipt"})
})

router.get('/:id',(req,res)=>{
    const {id} = req.params;

    let sql = "SELECT * FROM st_default_receipt_no WHERE id=?";
    conn.query(sql,[id],(err,results,fields)=>{
        if(err){
            console.log(err);
            return res.status(404).send("receipt not found");
        }else{
         let receipt =  results.map(row=>({...row}));
            return res.json({receipt})        
        }
    })
    // return res.json({msg:"get one receipt"})
})


router.patch('/:id',(req,res)=>{
    const { id } = req.params;
    const { receipt } = req.body;
    if(!receipt){
        return res.status(406).send("details not provided ");
    }
    let query = "UPDATE st_default_receipt_no SET ";
    let values = [];
    Object.entries(receipt).forEach((update) => {
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
      return res.json({ err: "id is required" });
    }
    let sql = "DELETE from st_default_receipt_no WHERE id=? ";
    conn.query(sql, [id], (err, results, fields) => {
      console.log(results);
      return res.status(200).send("done");
    });
})

module.exports = router;







