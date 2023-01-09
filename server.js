const express = require("express")
const mongoose = require("mongoose")
const multer = require("multer")
const crypto = require("crypto")
const path = require("path")
const cors = require("cors")
const fs = require("fs")
require("dotenv").config()

const Image = require("./Image.model")

const app = express()



mongoose.connect(process.env.MONGO_URI, (err) => {
    if(err) {
        console.log("ERROR: mongo connection")
    } else {
        console.log("Success: connected to mongo")
    }
})

const storage = multer.diskStorage({
    destination:"./uploads",
    filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, buff) => {
            if(err) return err
            
            const filename = buff.toString("hex") + path.extname(file.originalname)

            cb(null, filename)
        })
    }
})


const upload = multer({storage})
app.use(express.static("uploads"))
app.use(cors({
    origin: "*"
}))

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})


app.post("/upload", upload.single("file"), async (req, res) => {
    const {originalname, filename, mimetype, path} = req.file



    const newImage = new Image({
        name: originalname,
        image: {
            data: filename,
            contentType: mimetype,
        },
        path: path,
    })

    console.log(newImage)

    try {
        await newImage.save()

        res.status(200).json({
            message: "uploaded!",
            image: newImage
        })
    } catch (e) {
        res.status(500).json({
            message: e
        })
    }
})


app.get("/upload/:imgId", async (req, res) => {
    const {imgId} = req.params

    try {
        const image = await Image.findById(imgId)
        console.log(image)
      
        res.status(200).json(image)
    } catch (e) {
        res.status(500).json({
            message: e
        })
    }

})



app.listen(8080, () => {
    console.log("server: up and running on 8080")
})


