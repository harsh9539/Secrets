//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = {
    email: String,
    password: String
}


const User = new mongoose.model("User",userSchema);
// Home route
app.route("/")

.get(function(req,res){
    res.render("Home");
});
// login Route
app.route("/login")

.get(function(req,res){
    res.render("login");
})
.post(function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},function(err,foundUser){
        if(!err){
            if(foundUser){
            if(foundUser.password === password){
                res.render("secrets");
            }
        }
    }
    })
});

// register route
app.route("/register")

.get(function(req,res){
    res.render("register");
})
.post(function(req,res){
    const userName = req.body.username;
    const userPass = req.body.password;
    const newUser = new User({
        email : userName,
        password: userPass
    })
    newUser.save(function(err){
        if(!err){
            res.render("secrets");
        }
    });
});

// secret route





app.listen(3000,function(req,res){
    console.log("Your Server is OK to go");
})
