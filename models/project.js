var mongoose = require("mongoose");

var projectSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    date : { type : Date, default: Date.now },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "User"
        }, 
        username: String
    }, 
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Image"
        }
    ]
});

module.exports = mongoose.model("Project", projectSchema);