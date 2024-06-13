const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")        //importing encryption package
const jwt =require("jsonwebtoken")
const { blogmodel } = require("./models/blog.js")

const app = express()
app.use(cors())
app.use(express.json())
mongoose.connect("mongodb+srv://feb:febin4475@cluster0.pydodfi.mongodb.net/BlogDb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

//api for signup
app.post("/signup", async (req, res) => {
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.pass)
    console.log(hashedPassword)
    input.pass = hashedPassword       //hashed passwd is snd to the db
    let blog = new blogmodel(input)
    blog.save()
    res.json({ "status": "success" })
})

//api for SignIn

app.post("/signin", (req, res) => {
    let input = req.body
    blogmodel.find({ "em": req.body.em }).then(                    //"em" : req.body.em  both em must be same 
        (response) => {
            //if the email given is wrong , an EMPTY ARRAY will be displayed, else the data will be shown

            // console.log(response)                           
            if (response.length > 0) {
                let dbpass = response[0].pass
                console.log(dbpass)
                bcrypt.compare(input.pass,dbpass,(error,ismatch)=>{
                    if (ismatch) {
                       jwt.sign({email:input.em},"blog-app",{expiresIn:"1d"},(error,token)=>{
                        if (error) {
                            res.json({"status":"Unavailable to create token"})
                            
                        } else {
                            res.json({"status":"success","userid":response[0]._id,"token":token})   //Authentication TOken
                            
                        }

                       })           //always email : ______ , email is a syntax
                        
                    } else {
                        res.json({"status":"Incorrect Password"})
                    }
                })
            } else {
                res.json({ "status": "User Not Found!!!" })

            }

        }
    )
    // res.json({ "status": "success" })
})




app.post("/viewusers",(req,res)=>{
    let token = req.headers["token"]
    jwt.verify(token,"blog-app",(error,decoded)=>{
        if (error) {
            res.json({"status":"Unauthorized Access"})
            
        } else {
            if(decoded){blogmodel.find().then(
                (response)=>{
                    res.json(response)
                }
            ).catch()

            }
            
        }

    })
    
    blogmodel.find().then(
        (response)=>{
            res.json(response)
        }
    )
    

    

})



app.listen(8080, () => {
    console.log("Server Started!")
})