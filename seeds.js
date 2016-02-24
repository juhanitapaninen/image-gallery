var mongoose = require("mongoose");
var Image = require("./models/image");
var Comment = require("./models/comment");

// Initialize the database with some predefined data for development purposes

var data = [
    {
        name: "Cloud's Rest", 
        image:"https://farm4.staticflickr.com/3514/3844623716_427ed81275.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc."
    },
    {
        name: "Desert Mesa", 
        image:"https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg",
        description: "Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa. Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus, ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum velit. "
    },
    {
        name: "Canyon Floor", 
        image:"https://farm5.staticflickr.com/4010/4344237662_4a094cd73c.jpg",
        description: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna luctus suscipit. Sed lectus. "
    },
]

function seedDB(){
    // Remove all images
    
    Image.remove({}, function(err){
        /*if(err){
            console.log(err);
        }
        console.log("removed images!");
        // Add data
        data.forEach(function(seed){
            Image.create(seed, function(err, image){
                if(err){
                    console.log(err);
                } else {
                    console.log("added a image!");
                    // Create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet.",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                image.comments.push(comment);
                                image.save()
                                console.log("created new comment.");
                            }
                        });
                }
            });
        });*/
    });
}

module.exports = seedDB;

