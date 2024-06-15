const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');

const app = express();

//convert data into JSON format
app.use(express.json());

app.use(express.urlencoded({extended:false}));

// use ejs as view engine 
app.set("view engine", 'ejs');

// static file render
app.use(express.static("public"));
app.get('/', (req, res) => {
    res.render('login');
})

app.get('/signup',(req,res)=>{
    res.render('signup');
})

// Register User 
app.post("/signup",async (req,res)=>{

    const data = {
        name:req.body.username,
        email:req.body.email,
        password:req.body.password
    }

    // check if user already exists in the database 
    const existingUser = await collection.findOne({name:data.name});
    if(existingUser){
        res.send("User already exists. Please choose different username.");
        return;
    }
    else{
        // hash password using bcrypt method 
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password,saltRounds);

        data.password = hashedPassword; //Replace hashed password with original password

        const userdata = await collection.insertMany(data);
        // console.log(userdata);
        res.render('login');
    }

});

// Login User 

app.post("/login",async (req,res)=>{
    try{
        const check = await collection.findOne({name:req.body.username});
        if(!check){
            res.send("user name cannot found");
            return;
        }

        //compare the hashed password from the database with plain text 
        const isPasswordMatch = await bcrypt.compare(req.body.password,check.password);
        if(isPasswordMatch){
            res.render('home');
        }else{
           res.send("Wrong password");
        }
    }catch{
        res.send("wrong details!");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})