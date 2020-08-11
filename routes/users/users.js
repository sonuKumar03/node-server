var express = require("express");
const conn = require("../../db/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

var router = express.Router();
const secretKey = "the quiz brown fox jumps  over the lazy dog";


// route for login
router.post("/login", (req, res) => {
  const { user } = req.body;
  let query_with_email_id = "SELECT `password`   FROM  st_user_login WHERE email_id=? ";
  let query_with_username="SELECT `password`  FROM st_user_login WHERE user_name=?";
  conn.query(query_with_email_id,[user.email_id],(err,results,fields)=>{
    if(err){
      console.log(err);
      return res.status(401).json({message:"some error occured try again after some time "}) ;
    }
    if(results.length>=1){
        // return res.send("found with email");
        const hash_password = results[0].password;
        bcrypt.compare(user.password,hash_password,(err,result)=>{
            if(result){
              return res.json({message:"found user with email and correct password"});
            }else{
              return res.json({message:"found user with email and incorrect password"});
            }
        })
    }
    else{
        conn.query(query_with_username,[user.email_id],(err,results,fields)=>{
          if(results.length>=1){
            // return res.send("found by username");
            const hash_password = results[0].password;
            bcrypt.compare(user.password,hash_password,(err,result)=>{
              if(result){
                return res.json({message:"found user with email and correct password"});
              }else{
                return res.send({message:"found user with email and incorrect password"});
              }
          })
          }
            else{
              return res.status(404).json({error:"user doesn't exit"})
          }
        })
    }
  })
});

router.post('/signup',(req,res)=>{
  const {user} = req.body; 

  let check_query_email_id = "SELECT `email_id` FROM st_user_login WHERE email_id=?";
  let check_query_user_name = "SELECT `user_name` FROM st_user_login WHERE  user_name=?";

  // check for email 
  conn.query(check_query_email_id,[user.email_id],(err,results,fields)=>{
    if(err){
      return res.status(501).json({message:"some error occured "});
    }
      else{
        if(results.length>=1){
          return res.status(401).json({message:"email taken"});
        }else{
          conn.query(check_query_user_name,[user.user_name],(err,results,fields)=>{
           if(err){
              return res.status(501).json({message:"some error occured "})
           }else{
             if(results.length>=1){
               return res.status(401).json({message:"user_name already taken "});
             }
            let _user = Object.keys(user);
            let col = _user.join(',');
            let query = "INSERT INTO st_user_login("+col+") VALUES";
            let values = Object.values(user);

            let qs = _user.map((t)=>"?").join(',');
            query+="("+qs+")";
            conn.query(query,values,(err,results,fields)=>{
                if(err){
                  return res.status(501).json({message:"server errro"});
                }else{
                  return res.status(201).json({message:"created"});
                }
             })
           } 
        })
      }
    }
  })
  // return res.send("hi from signup")
})

router.get("/", function (req, res) {
  if (!req.header("Authorization")) {
    return res.status(401).json({
      error: {
        reason: "Invalid Sessiontoken",
        code: 401,
      },
    });
  }
  let bearer = req.header("Authorization");
  let token = bearer.split(" ")[1];
  if (token.length < 1) {
    return res.status(401).json({
      error: {
        reason: "Invalid Sessiontoken",
        code: 401,
      },
    });
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    console.log(err);
    console.log(decoded);
  });
  res.json({ msg: "user route" });
});

module.exports = router;
