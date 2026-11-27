const express = require('express');
require('dotenv').config();
const app=express()
const cors= require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cookieParser = require("cookie-parser");
const connect=require("./Config/db");
const authRoute=require("./Routes/authRoute");
const userRoutes = require("./Routes/userRoute"); 
const companyRoutes = require("./Routes/companyRoute")
const resumeRoute = require("./Routes/resumeRoutes")
const applicationRoutes = require('./Routes/applicationRoutes')
const jobRoutes = require("./Routes/jobRoute");
const resumeAIRoutes= require("./Routes/resumeAIRoutes")
const savedJobRoutes = require("./Routes/savedJobRoutes");
connect();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser());
app.use('/auth',authRoute);
app.use('/user',userRoutes);
app.use('/company',companyRoutes);
app.use('/job',jobRoutes);
app.use("/saved-jobs", savedJobRoutes);
app.use("/api/resume-ai", resumeAIRoutes);
app.use('/resume',resumeRoute);
app.use('/application',applicationRoutes);
const PORT = process.env.PORT||3000;

app.listen(PORT,()=>{
    console.log(`server running on http://localhost:${PORT}`);
})
