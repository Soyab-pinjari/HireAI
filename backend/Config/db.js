const { default: mongoose } = require("mongoose");



const connect=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("mongoDB connected");
    } catch (error) {
        console.log(error)
    }
}

module.exports=connect;