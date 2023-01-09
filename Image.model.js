const mongoose = require("mongoose")


const ImageSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    image: {
        data: String,
        contentType: String,
    },
    path: {
        required: true,
        type: String
    }
},
{
    timestamps: true
})


module.exports = mongoose.model("Image", ImageSchema)