const router = require('express').Router();
const conn = require('../../db/index')

// get all the ready stock ; 
router.get('/',(req,res)=>{
    let sql = 'SELECT * FROM `st_ready_product_stock`';
    conn.query(sql,(err,results,fields)=>{
        if(err){
            return res.statusCode(501).json({ message: "internal server error"});
        }
        let ready_stocks = results.map((res)=>({...res}));
        return res.json({ready_stocks});
    })
})

module.exports = router;