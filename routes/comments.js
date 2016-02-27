var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
var Image = require("../models/image");
var Comment = require("../models/comment");

// Comments new
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Image.findById(req.params.id, function(err, image){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {image: image});
        }
    });
    
});

// Comments create
router.post("/", middleware.isLoggedIn, function(req, res) {
    Image.findById(req.params.id, function(err, image) {
        if(err){
            req.flash("error", "Something went wrong");
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
                    req.flash("success", "Succesfully added comment");
                    res.redirect("/images/" + image._id);
                }
            })
        }
    });
});

// Edit comment route
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {image_id: req.params.id, comment: foundComment});
        }
    });
});

// Update comment route
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/images/" + req.params.id);
       }
    });
});

// Destroy comment route
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/images/" + req.params.id);
       }
    });
});

module.exports = router;