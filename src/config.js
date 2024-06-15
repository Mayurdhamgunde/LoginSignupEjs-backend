const mongoose = require('mongoose');
const connect = mongoose.connect("mongodb://localhost:27017/Ejs-tut");

// check database connected or not
connect.then(()=>{
    console.log("Database connected succesfully");
})
.catch(()=>{
    console.log("error while connecting database");
});

// Create a schema
const LoginSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    password:{
        type:String,
        required:true
    }
});

//collection part of database
const collection = new mongoose.model("users",LoginSchema);

module.exports = collection;

