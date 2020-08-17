var express = require("express");
const conn = require("../../db/index");
var router = express.Router();


router.get('/',(req,res)=>{
    return res.json({
        message:"transportation route"
    })
})


module.exports = router;