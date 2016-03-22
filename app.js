var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    flash           = require("connect-flash"),
    Image           = require("./models/image"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds")

// Requiring routes
var projectRoutes   = require("./routes/projects"),
    imageRoutes     = require("./routes/images"),
    commentRoutes   = require("./routes/comments"),
    indexRoutes     = require("./routes/index")
    
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
//mongoose.connect("mongodb://localhost/image_gallery");
mongoose.connect("mongodb://juhe:juhefin@ds021989.mlab.com:21989/image-gallery");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); // seed the database 

// Passport config
app.use(require("express-session")({
    secret: "Mag Gyver beats Superman!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass currentUser to every template
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", indexRoutes);
app.use("/projects", projectRoutes);
app.use("/projects/:id/images", imageRoutes);
app.use("/projects/:id/images/:image_id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The server has started!"); 
});