const mongoose=require("mongoose")
const schema=mongoose.Schema(
    {
        "nam":String,
        "em":String,
        "pass":String
    }
)

let blogmodel=mongoose.model("users",schema)
module.exports={blogmodel}