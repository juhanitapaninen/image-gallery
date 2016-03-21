var express = require("express");
var router = express.Router({mergeParams: true});
var Image = require("../models/image");
var Project = require("../models/project");
var middleware = require("../middleware");

// Show more info about one item
router.get("/:image_id", function(req, res){
    Project.findById(req.params.id).exec(function(err, foundProject){
        if(err){
            console.log(err);
            req.flash("error", "Project not found");
            return res.redirect("back");
        } else {
            Image.findById(req.params.image_id).populate("comments").exec(function(err, foundimage){
                if(err){
                    console.log(err);
                    req.flash("error", "Image not found");
                    return res.redirect("back");
                } else {
                    res.render("images/show", {project: foundProject, image: foundimage});
                }
            });
        }
    });
});

// Edit image route
router.get("/:image_id/edit", middleware.checkImageOwnership, function(req, res) {
    Project.findById(req.params.id).exec(function(err, foundProject){
        if(err){
            console.log(err);
            req.flash("error", "Project not found");
            return res.redirect("back");
        } else {
            Image.findById(req.params.image_id, function(err, foundImage){
                if(err){
                    req.flash("error", "Image not found");
                    return res.redirect("back");
                } else {
                    res.render("images/edit", {project: foundProject, image: foundImage});
                }
            });
        }
    });
});

// Update image route
router.put("/:image_id", middleware.checkImageOwnership, function(req, res){
    Image.findByIdAndUpdate(req.params.image_id, req.body.image, function(err, updatedImage){
       if(err){
           req.flash("error", "Image not found");
           res.redirect("/projects/" + req.params.id);
       } else {
           req.flash("success", "Succesfylly edited image");
           res.redirect("/projects/" + req.params.id + /images/ + req.params.image_id);
       }
    });
});

// Destroy image route
router.delete("/:image_id", middleware.checkImageOwnership, function(req, res){
    Image.findByIdAndRemove(req.params.image_id, function(err){
       if(err){
           req.flash("error", "Image not found");
           res.redirect("/projects/" + req.params.id);
       } else {
            req.flash("success", "Image deleted");
           res.redirect("/projects/" + req.params.id);
       }
    });
});

module.exports = router;