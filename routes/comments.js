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

// Edit comment route
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {image_id: req.params.id, comment: foundComment});
        }
    });
});

// Update comment route
router.put("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/images/" + req.params.id);
       }
    });
});

// Destroy comment route
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/images/" + req.params.id);
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

function checkCommentOwnership(req, res, next){
     if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                // foundComment.author.id is an object
                // req.user._id is a string --> cannot compare with == or ===
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

module.exports = router;