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
           req.flash("error", err.message);
           return res.redirect("back");
       } else {
           passport.authenticate("local")(req, res, function(){
               req.flash("success", "Welcome to Image Gallery " + user.username);
               res.redirect("/projects");
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
        successRedirect: "/projects",
        failureRedirect: "/login", 
        failureFlash: true, 
        successFlash: 'Welcome!'
    }), function(req, res) {
});

// Handle logout logic
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You logged out!");
    res.redirect("/");
});

module.exports = router;