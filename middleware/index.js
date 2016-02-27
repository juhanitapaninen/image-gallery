var Image = require("../models/image");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkImageOwnership = function checkImageOwnership(req, res, next){
    if(req.isAuthenticated()){
        Image.findById(req.params.id, function(err, foundImage){
            if(err){
                req.flash("error", "Image not found");
                res.redirect("/images");
            } else {
                // foundImage.author.id is an object
                // req.user._id is a string --> cannot compare with == or ===
                if(foundImage.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Image not found");
                res.redirect("back");
            } else {
                // foundComment.author.id is an object
                // req.user._id is a string --> cannot compare with == or ===
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You must be logged in to do that");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to do that");
    res.redirect("/login");
}


module.exports = middlewareObj;