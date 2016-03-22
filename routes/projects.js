var express =       require("express");
var router =        express.Router();
var Project =       require("../models/project");
var Image =         require("../models/image");
var middleware =    require("../middleware");
var fs =            require('fs');
var lwip =          require('lwip');
var multer  =       require('multer');
var upload =        multer({ dest: 'uploads/' });

var MAX_WIDHT = 1024;
var MAX_HEIGHT = 768;

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
    Project.findById(req.params.id).populate("images").populate("comments").exec(function(err, foundProject){
        if(err){
            console.log(err);
            req.flash("error", "Project not found");
            return res.redirect("back");
        } else {
            res.render("projects/show", {project: foundProject});
            /*Image.find({}, function(err, images){
                if(err){
                    console.log(err);
                    return res.redirect("back");
                } else {
                    res.render("projects/show", {project: foundProject, images:images});
                    //res.render("images/index", {images:images}); 
                }
            });*/
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
router.post("/:id/file-upload", middleware.isLoggedIn, upload.single('file'), function(req, res) {
    try {
        fs.readFile(req.file.path, function(err, buffer) {
            if (err) throw err;
            lwip.open(buffer, req.file.originalname.split('.').pop(), function(err, image) {
                if (err) throw err;
                var scaleRatio = image.width() >= image.height() ? MAX_WIDHT / image.width() : MAX_HEIGHT / image.height();
                scaleRatio = scaleRatio > 1 ? 1 : scaleRatio; // Do not scale image bigger than it already is
                image.scale(scaleRatio, function(err, resizedImage) {
                    if (err) throw err;
                    image.toBuffer('jpg', function(err, buffer){
                        if (err) throw err;
                        var name = req.file.originalname;
                        var imageData = {
                            data: buffer,
                            contentType: req.file.mimetype,
                        }  
                        var author = {
                            id: req.user._id,
                            username: req.user.username
                        }
                        var newimage = {name: name, imageData: imageData, author: author};
                        Image.create(newimage, function(err, newlyCreated){
                            if (err) throw err;
                            Project.findById(req.params.id, function(err, project) {
                                if (err) throw err;
                                project.images.push(newlyCreated);
                                project.save();
                                fs.unlinkSync(req.file.path); // Remove the temporary saved image
                                req.flash("success", "Succesfully added image");
                                res.redirect("back");
                            });
                        });
                    });
                });
            });
        });
    } catch (e) {
        console.log(e);
        req.flash("error", "Something went wrong");
        return res.redirect("back");
    }
});

module.exports = router;