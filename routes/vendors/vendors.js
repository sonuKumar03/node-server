var express = require("express");
const mysql = require("mysql");
const conn = require("../../db/index");
const { check, validationResult } = require("express-validator");
var router = express.Router();

let id_check =(req,res,next)=>{
  const { id } = req.params;
  if (!id) {
    return res.json({ err: "id is required" });
  }
  let check_id_query = "SELECT vendor_id from st_vendor_info WHERE vendor_id=?";
  conn.query(check_id_query,[id],(err,results,fields)=>{
    if(err){
      return res.json({ message:"internal error occured ",error:err})
    }
    if(results.length==0){
      return res.json({ message:" vendor of provided id doesn't exit " });
    }
    next();
  })
}


router.get("/", function (req, res) {
  let sql = "SELECT * FROM st_vendor_info ";
  conn.query(sql, (err, results, fields) => {
    if (err) {
    } else {
      let vendors = results.map((row) => ({ ...row }));
      return res.json({ vendors });
    }
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  let sql = "SELECT * FROM st_vendor_info WHERE vendor_id=?";
  conn.query(sql, [id], (err, results, fields) => {
    if (err) {
      return res.status(501).json({ message: "server error" });
    }
    if (results.length == 0) {
      return res.status(404).json({ msg: "vendor not exits" });
    }
    const vendors = results.map((res) => ({ ...res }));
    return res.status(200).json({ vendor: vendors[0] });
  });
});

// add vendor
router.post("/", (req, res) => {
  const { vendor } = req.body;
  if (!vendor.balance) {
    vendor.balance = 0;
  }
  const email = vendor.email_id;
  let values = Object.values(vendor);
  let cols = Object.keys(vendor);
  let emailCheckQuery ="SELECT email_id from st_vendor_info WHERE `email_id`=? ";
  conn.query(emailCheckQuery, [email], (err, results, fields) => {
    if (err) {
      console.log(err);
      return res.json({ error: err });
    }
    if (results.length==0) {
      let values = Object.values(vendor);
      let cols = Object.keys(vendor);
      let insrt_query =
        "INSERT INTO st_vendor_info ( " +
        cols.map((col) => `${col}`).join(",") +
        " ) VALUES ( " +
        cols.map((col) => "?").join(",") +
        " )";
      conn.query(insrt_query, values, (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.json({
            error: err,
          });
        } else {
          console.log(results);
          return res.json({message:"vendor created successfully"});
        }
      });
    } else {
      return res.json({ message: "email already exist" });
    }
  });
});

router.patch("/:id", id_check,(req, res) => {
  const { id } = req.params;
  const { vendor } = req.body;
  let keys = Object.keys(vendor);
  let values = Object.values(vendor);
  values.push(id);
  let update_query = "UPDATE st_vendor_info SET "+keys.map((key)=>`${key}=?`).join(",")+" WHERE vendor_id=? ";
  conn.query(update_query,values,(err,results,fields)=>{
    if(err){
      return res.status(456).json({message:"some error occured ",error:err});
    }
    return res.status(200).json({ message: " vendor of provided id updated  " });
  })
});



router.delete("/:id",id_check,(req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.json({ err: "id is required" });
  }
    let sql = "DELETE from st_vendor_info WHERE vendor_id=?";
      conn.query(sql, [id], (err, results, fields) => {
        console.log(results);
          return res.status(200).json({ message: " vendor of provided id deleted  " });
      });   
});

module.exports = router;
