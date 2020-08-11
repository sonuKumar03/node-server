const express = require('express');
const router = express.Router();
const conn = require('../../db/index')

// get all purchases 
router.get('/',(req,res)=>{
    const query = 'SELECT * FROM `st_purchase_product_info`';
    conn.query(query,(err,results,fields)=>{
        if(err){
            return res.status(501).json({message:"internal error occured"});
        }
        let purchases = results.map((res)=>({...res}));
        return res.json({purchases});
    })
})
