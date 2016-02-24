var express = require("express");
var router = express.Router();
var Image = require("../models/image");

// Index - Show all images
router.get("/", function(req, res) {
    req.user
    Image.find({}, function(err, images){
        if(err){
            console.log(err);
        } else {
            res.render("images/index", {images:images}); 
        }
    });
});

// Show new form
router.get("/new", isLoggedIn, function(req, res){
   res.render("images/new");
});

// Add to db
router.post("/", isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newimage = {name: name, image: image, description: desc, author: author};
    
    Image.create(newimage, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log(newlyCreated);
            res.redirect("images");
        }
    });
});

// Show more info about one item
router.get("/:id", function(req, res){
    Image.findById(req.params.id).populate("comments").exec(function(err, foundimage){
        if(err){
            console.log(err);
        } else {
            console.log(foundimage);
            res.render("images/show", {image: foundimage});
        }
    });
});

// Edit image route
router.get("/:id/edit", function(req, res) {
    Image.findById(req.params.id, function(err, foundImage){
        if(err){
            res.redirect("/images");
        } else {
            res.render("images/edit", {image: foundImage});
        }
    });
});

// Update image route
router.put("/:id", function(req, res){
    Image.findByIdAndUpdate(req.params.id, req.body.image, function(err, updatedImage){
       if(err){
           res.redirect("/images");
       } else {
           res.redirect("/images/" + req.params.id);
       }
    });
});

// Destroy image route
router.delete("/:id", function(req, res){
    Image.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/images");
       } else {
           res.redirect("/images");
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