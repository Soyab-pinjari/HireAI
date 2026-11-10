const { default: mongoose } = require("mongoose");


const JobSchema = new mongoose.Schema({
    jobTitle:{
        type:String,
        trim:true,
        required:true
    },
    type:{
        type:String,
        lowercase:true,
        required:true
    },
      company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
 experience:{
    type:Number,
    default:0,
    required:true
     },
    salary:{
        type:Number,
        required:true
    },
    vacancies: {
    type: Number,
    default: 1,
    min: 1
  },
  address:{
    type:String,
    trim:true,
    required:true
  },
  skills:{
    type:String,
    lowercase:true,
    trim:true,
    required:true
  },
description:{
type:String,
required:true,
}
},{timestamps:true})


module.exports = mongoose.model("Job",JobSchema);