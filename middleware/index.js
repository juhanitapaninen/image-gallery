var Image = require("../models/image");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkImageOwnership = function checkImageOwnership(req, res, next){
    if(req.isAuthenticated()){
        Image.findById(req.params.id, function(err, foundImage){
            if(err){
                res.redirect("/images");
            } else {
                // foundImage.author.id is an object
                // req.user._id is a string --> cannot compare with == or ===
                if(foundImage.author.id.equals(req.user._id)){
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


middlewareObj.checkCommentOwnership = function checkCommentOwnership(req, res, next){
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


middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = middlewareObj;