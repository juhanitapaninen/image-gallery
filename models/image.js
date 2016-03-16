var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
    name: String,
    image: String,
    imageData: { data: Buffer, contentType: String },
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        }, 
        username: String
    }, 
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Image", imageSchema);