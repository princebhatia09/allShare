const express = require("express")
const connectdb = require("./config/db");
const path = require("path");
//Temlate Engine

const app = express()
app.set("views",path.join(__dirname,"/views"))
app.set("view engine","ejs")

app.use(express.static("public"))
app.use(express.json())

const PORT = process.env.PORT || 3000;

connectdb();
// console.log(process.env.PORT)

// here database connected

// Routes
app.use("/api/files",require("./routes/files"));
app.use("/files",require("./routes/show"));
app.use("/files/download",require("./routes/download"))


app.listen(PORT,()=>{
    console.log(`Listening on post ${PORT}`)
})  

