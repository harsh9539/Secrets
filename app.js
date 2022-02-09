//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
// const encrypt = require("mongoose-encryption");
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;

const app = express();

// console.log(process.env.SECRET);
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(session({
    secret:"Our little secret.",
    resave:false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});


const User = new mongoose.model("User",userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
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
    // const username = req.body.username;
    // const password = (req.body.password);
    // User.findOne({email:username},function(err,foundUser){
    //     if(!err){
    //         if(foundUser){
    //             bcrypt.compare(password, foundUser.password, function(err, result) {
    //                 if(result == true){
                        
    //                     res.render("secrets");
    //                 }
    //                 });
            
    //     }
    // }
    // })
    const user = new User({
        username: req.body.username,
        password: req.body.password

    });
    // This method is comes from passport module
    req.login(user,function(err){
        if(!err){
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })
});

// register route
app.route("/register")

.get(function(req,res){
    res.render("register");
})
.post(function(req,res){
    // bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    //     const newUser = new User({
    //         email : req.body.username,
    //         password: hash
    //     })
            
    // newUser.save(function(err){
    //     if(!err){
    //         res.render("secrets");
    //     }
    // });
    // });

    User.register({username: req.body.username},req.body.password,function(err,user){
        if(!err){
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })
        }
    })

});

// secret route
app.route("/secrets")
.get(function(req,res){
    if(req.isAuthenticated){
        res.render("secrets");
    }
    else{
        res.redirect("login");
    }
});

// logout route

app.route("/logout")
.get(function(req,res){
    req.logout();
    res.redirect("/");
})
app.listen(3000,function(req,res){
    console.log("Your Server is OK to go");
})

