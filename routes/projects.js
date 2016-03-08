var express = require("express");
var router = express.Router();
var Project = require("../models/project");
var middleware = require("../middleware");

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

module.exports = router;