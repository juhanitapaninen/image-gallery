var express = require("express");
var router = express.Router({mergeParams: true});
var Image = require("../models/image");
var Comment = require("../models/comment");

// Comments new
router.get("/new", isLoggedIn, function(req, res) {
    Image.findById(req.params.id, function(err, image){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {image: image});
        }
    });
    
});

// Comments create
router.post("/", isLoggedIn, function(req, res) {
    Image.findById(req.params.id, function(err, image) {
        if(err){
            console.log(err);
            res.redirect("/images");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err){
                    console.log(err);
                } else {
                    // Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    image.comments.push(comment);
                    image.save();
                    res.redirect("/images/" + image._id);
                }
            })
        }
    });
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;