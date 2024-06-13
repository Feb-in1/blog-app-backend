const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")        //importing encryption package
const { blogmodel } = require("./models/blog.js")

const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://feb:febin4475@cluster0.pydodfi.mongodb.net/BlogDb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password,salt)
}
app.post("/signup", async(req, res) => {
    let input = req.body
    let hashedPassword=await generateHashedPassword(input.pass)
    console.log(hashedPassword)
    input.pass=hashedPassword       //hashed passwd is snd to the db
    let blog= new blogmodel(input)
    blog.save()
    res.json({ "status": "success" })
})

app.listen(8080, () => {
    console.log("Server Started!")
})