require("dotenv").config()

const mongoose = require("mongoose")

function connectDb(){

    //database connection

    mongoose.connect(process.env.MONGO_CONNECTION_URL,{userNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true,useFindAndModify:true});

    const connection = mongoose.connection;

    connection.once('open',()=>{
        console.log("Database connected");
    }).catch(err=>{
        console.log("Connextion failed");
    })
    // xHZt4hxAs1swgQ5W

}

module.exports = connectDb;