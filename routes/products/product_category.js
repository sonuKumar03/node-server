const express = require('express');
const router  = express.Router();
const conn = require('../../db/index');
const mysql = require('mysql')

router.get('/',(req,res)=>{
    let sql = "SELECT * FROM st_product_category ";
    conn.query(sql,(err,results,fields)=>{
        if(err){
            return res.status(501).json({message:"error occured on our side ",error:err});
        }else{  
         let product_categorys =  results.map(row=>({...row}));
            return res.json({product_categorys})        
        }
    })
})

// add one product_category
router.post('/',(req,res)=>{
    let {product_category} = req.body;
    if(!product_category){
        return res.status(406).json({err:"provide product_category details"});
    }
    let columns = Object.keys(product_category);
    let col = columns.join(',');
    console.log(columns);
    let query = "INSERT INTO st_product_category_info("+columns+") VALUES";
    let values = Object.values(product_category);
    let qs = columns.map((t)=>"?").join(',');
    query+="("+qs+")";
    conn.query(query,values,(err,results,fields)=>{
        if(err){
            console.log(err);
        }else{
            console.log(results);
        }
    })
    return res.json({msg:"add one product_category"})
})

router.get('/:id',(req,res)=>{
    const {id} = req.params;

    let sql = "SELECT * FROM st_product_category_info WHERE id=?";
    conn.query(sql,[id],(err,results,fields)=>{
        if(err){
            console.log(err);
            return res.status(404).send("product_category not found");
        }else{
         let product_category =  results.map(row=>({...row}));
            return res.json({product_category})        
        }
    })
})


router.patch('/:id',(req,res)=>{
    const { id } = req.params;
    const { product_category } = req.body;
    if(!product_category){
        return res.status(406).send("details not provided ");
    }
    let query = "UPDATE st_product_category_info SET ";
    let values = [];
    Object.entries(product_category).forEach((update) => {
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
    let sql = "DELETE from st_product_category_info WHERE id=? ";
    conn.query(sql, [id], (err, results, fields) => {
      console.log(results);
      return res.status(200).json({message:"done"});
    });
})

module.exports = router;







