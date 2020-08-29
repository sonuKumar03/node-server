var express = require("express");
const conn = require("../../db/index");
var router = express.Router();

// type

router.post('/category',(req,res)=>{
    const {category} = req.body;
    if(!category){
        return res.json({message:"category not provided"});
    }
    let columns = Object.keys(category);
    let values = Object.values(category);
    let sql = "INSERT INTO st_transportation_type( "+columns.join(",")+") VALUES ( "+values.map(v=>"?").join(",")+") ";
    conn.query(sql,values,(err,results,fields)=>{
        if(err){
            return res.json({error:err})
        }
        return res.json({message:"added"});
    })
})

router.get("/category",(req,res)=>{
    
})

router.get('/',(req,res)=>{
    return res.json({
        message:"transportation route"
    })
})


module.exports = router;