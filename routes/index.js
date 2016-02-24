var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root route 
router.get("/", function(req, res){
    res.render("landing");
});

// Show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// Handle sign up logic
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           return res.render("register");
       } else {
           passport.authenticate("local")(req, res, function(){
               res.redirect("/images");
           });
       }
   });
});

// Show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/images",
        failureRedirect: "/login"
    }), function(req, res) {
});

// Handle logout logic
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/images");
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;