const express = require('express');
const router  = express.Router();
const conn = require('../../db/index');
const mysql = require('mysql')




router.post('/categories',(req,res)=>{
    let {expense} = req.body;
    if(!expense){
        return res.status(406).json({err:"provide expense details"});
    }
    let columns = Object.keys(expense);
    let col = columns.join(',');
    console.log(columns);
    let query = "INSERT INTO st_expense_category("+columns+") VALUES";
    let values = Object.values(expense);
    let qs = columns.map((t)=>"?").join(',');
    query+="("+qs+")";

    conn.query(query,values,(err,results,fields)=>{
        if(err){
            console.log(err);
        return res.status(501).json({message:"category not added"})
        }else{
            console.log(results);
            return res.json({msg:"add one expense"})
        }
    })
})

router.get('/categories',(req,res)=>{
    let sql = "SELECT * FROM st_expense_category";
    conn.query(sql,(err,results,fields)=>{
        if(err){
            return res.status(501).json({message:"error occured on our side "});
        }else{  
         let expenses =  results.map(row=>({...row}));
            return res.json({expenses})        
        }
    })
})

router.get('/',(req,res)=>{
    let sql = "SELECT * FROM st_expense_info ";
    conn.query(sql,(err,results,fields)=>{
        if(err){
            return res.status(501).json({message:"error occured on our side "});
        }else{  
         let expenses =  results.map(row=>({...row}));
            return res.json({expenses})        
        }
    })
})

// add one expense
router.post('/',(req,res)=>{
    let {expense} = req.body;
    if(!expense){
        return res.status(406).json({err:"provide expense details"});
    }
    let columns = Object.keys(expense);
    let col = columns.join(',');
    console.log(columns);
    let query = "INSERT INTO st_expense_info("+columns+") VALUES";
    let values = Object.values(expense);
    let qs = columns.map((t)=>"?").join(',');
    query+="("+qs+")";
    conn.query(query,values,(err,results,fields)=>{
        if(err){
            console.log(err);
        }else{
            console.log(results);
        }
    })
    return res.json({msg:"add one expense"})
})

router.get('/:id',(req,res)=>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({
            error:"id id required"
        })
    }
    let sql = "SELECT * FROM st_expense_info WHERE id=?";
    conn.query(sql,[id],(err,results,fields)=>{
        if(err){
            console.log(err);
            return res.status(404).send("expense not found");
        }else{
         let expense =  results.map(row=>({...row}));
            return res.json({expense})        
        }
    })
})


router.patch('/:id',(req,res)=>{
    const { id } = req.params;
    const { expense } = req.body;
    if(!expense || !id ){
        return res.status(406).send("details not provided ");
    }
    let query = "UPDATE st_expense_info SET ";
    let values = [];
    Object.entries(expense).forEach((update) => {
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
      return res.status(400).json({ err: "id is required" });
    }
    let sql = "DELETE from st_expense_info WHERE id=? ";
    conn.query(sql, [id], (err, results, fields) => {
      console.log(results);
      return res.status(200).send("done");
    });
})

module.exports = router;







