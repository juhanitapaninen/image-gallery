var express = require("express");
var router = express.Router();
var Project = require("../models/project");
var middleware = require("../middleware");
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });

// Index - Show all projects
router.get("/", function(req, res) {
    req.user
    Project.find({}, function(err, projects){
        if(err){
            console.log(err);
            return res.redirect("back");
        } else {
            res.render("projects/index", {projects:projects}); 
        }
    });
});

// Show new form
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("projects/new");
});

// Add to db
router.post("/", middleware.isLoggedIn, function(req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newProject = {name: name, image: image, description: desc, author: author};
    
    Project.create(newProject, function(err, newlyCreated){
        if(err){
            console.log(err);
            req.flash("error", "Error in creating project");
            return res.redirect("back");
        } else {
            req.flash("success", "Succesfylly added project " + newlyCreated.name);
            res.redirect("projects");
        }
    });
});

// Show more info about one item
router.get("/:id", function(req, res){
    Project.findById(req.params.id).populate("comments").exec(function(err, foundProject){
        if(err){
            console.log(err);
            req.flash("error", "Project not found");
            return res.redirect("back");
        } else {
            res.render("projects/show", {project: foundProject});
        }
    });
});

// Edit project route
router.get("/:id/edit", middleware.checkProjectOwnership, function(req, res) {
    Project.findById(req.params.id, function(err, foundProject){
        if(err){
            req.flash("error", "Project not found");
            return res.redirect("back");
        } else {
            res.render("projects/edit", {project: foundProject});
        }
    });
});

// Update project route
router.put("/:id", middleware.checkProjectOwnership, function(req, res){
    req.flash("error", "Not yet implemented");
    res.redirect("/images");
});

// Add to db
router.post("/:id/file-upload", middleware.isLoggedIn, upload.array('file', 12), function(req, res) {
    console.log('FILE UPLOAD! id: ' + req.params.id);
    console.log('Files: ' + req.files);

    res.redirect("back");
});

module.exports = router;