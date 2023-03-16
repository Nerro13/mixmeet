// const express = require("express")
const mysql = require("mysql");

// const app = express()
const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
require("./services/main");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mixmeet"
});
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/sign-up", (req, res) => {
  res.render("sign-up");
});
app.get("/sign-in", (req, res) => {
  res.render("sign-in");
});
app.post("/sign-in", (req, res) => {
    //confirm the email is registered
    //compare the passwords provided with the hash in db
    db.query("SELECT email FROM users WHERE email =?", [req.body.email], (err,results)=>{
        if(results.length>0){
            //proceed
            bcrypt.compare(req.body.password, results[0].password, (err, match)=>{
                if(match){
                    res.redirect("/");
                }else{
                    res.render("sign-in", {error:true, errorMessage: "Incorrect password."});
                }
            })
        }else{
            res.render("sign-in", {error: true, errorMessage: "The email is not registered"})
        }
    })
})
app.post("/sign-up", (req, res) => {
  //get the data by using the body parser
  //confirm password and password match
  //check if email exist in the database
  //encrypt the password
  //store all details in db
  console.log(req.body);
  if (req.body.password === req.body.confirm) {
    //proceed
    db.query(
      "SELECT email FROM users WHERE email=?",
      [req.body.email],
      (error, results) => {
        if (results.length>0) {
          //email exits in database
          res.render("sign-up", {
            error: true,
            errorMessage: "email already exists",
          });
        } else {
          //proceed
          bcrypt.hash(req.body.password, 4, function (err, hash) {
            //we have access to the hashed password as hash
            db.query(
              "INSERT INTO users(username,email,password,image_link,bio) VALUES(?,?,?,?,?)",
              [
                req.body.username,

                req.body.email,
                hash,
                "image.png",
                req.body.bio,
              ],
              (error) => {
                if (error) {
                  res.render("sign-up", {
                    error: true,
                    errorMessage: "OOPS SOMETHING WENT WRONG",
                  });
                } else {
                  res.redirect("/sign-in"); //successful sign up
                }
              }
            );
          });
        }
      }
    );
  } else {
    res.render("sign-up", {
      error: true,
      errorMessage: "passwords dont match",
    });
  }
});
app.listen(3001, () => {
  console.log("app running!!...");
});

// create a db called mixmeet
// have a table called users(user_id)
