const express = require('express');
const router  = express.Router();
const conn = require('../../db/index');
const mysql = require('mysql')

router.get('/',(req,res)=>{
    let sql = "SELECT * FROM st_raw_material_stock ";
    conn.query(sql,(err,results,fields)=>{
        if(err){
            return res.status(501).json({message:"error occured on our sproduct_ide "});
        }else{  
         let raw_materials =  results.map(row=>({...row}));
            return res.json({raw_materials})        
        }
    })
})

// add one raw_material
router.post('/',(req,res)=>{
    let {raw_material_stock} = req.body;
    if(!raw_material_stock){
        return res.status(406).json({err:"provite product raw_material details"});
    }
    let columns = Object.keys(raw_material_stock);
    let col = columns.join(',');
    console.log(columns);
    let query = "INSERT INTO st_raw_material_stock("+columns+") VALUES";
    let values = Object.values(raw_material_stock);
    let qs = columns.map((t)=>"?").join(',');
    query+="("+qs+")";
    conn.query(query,values,(err,results,fields)=>{
        if(err){
            console.log(err);
            return res.json({message:"raw_material not added",error:err})
        }else{
            console.log(results);
            return res.json({message:"add one raw_material"})
        }
    })
})

router.get('/:product_id',(req,res)=>{
    const {product_id} = req.params;
    let sql = "SELECT * FROM st_raw_material_stock WHERE product_id=?";
    conn.query(sql,[product_id],(err,results,fields)=>{
        if(err){
            return res.status(404).send("raw_material not found");
            console.log(err);
        }else{
         let raw_material =  results.map(row=>({...row}));
            return res.json({raw_material})        
        }
    })
})


router.patch('/:product_id',(req,res)=>{
    const { product_id } = req.params;
    const { raw_material } = req.body;
    if(!raw_material){
        return res.status(406).send("details not provproduct_ided ");
    }
    let query = "UPDATE st_raw_material_stock SET ";
    let values = [];
    Object.entries(raw_material).forEach((update) => {
      query += `${update[0]}=?,`;
      values.push(update[1]);
    });
    let index = query.lastIndexOf(",");
    let q = query.substring(0, index) + query.substring(index + 1, query.length);
    values.push(product_id);
    q += ` WHERE product_id=? `;
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

router.delete('/:product_id',(req,res)=>{
    const { product_id } = req.params;
    if (!product_id) {
      return res.status(404).json({message: "product_id is required" });
    }
    let sql = "DELETE from st_raw_material_stock WHERE product_id=? ";
    conn.query(sql, [product_id], (err, results, fields) => {
      console.log(results);
      return res.status(200).json({message:"done"});
    });
})

module.exports = router;







