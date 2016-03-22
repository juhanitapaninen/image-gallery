var mongoose = require("mongoose");

var imageSchema = new mongoose.Schema({
    name: String,
    imageData: { data: Buffer, contentType: String },
    description: String,
    date : { type : Date, default: Date.now },
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