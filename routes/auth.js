const router = require('express').Router(); 
const User = require('../models/User.js'); 
const {RegisterValidations, loginValidation} = require('../validations.js');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const cookieparse = require('cookie-parser');

router.post('/register', async (req,res)=>{ 
    //validating
    
    RegisterValidations(req.body).then(async(result) => {
        console.log(result);
        // hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password , salt);
    
        const user = new User({ 
            name : req.body.name, 
            email : req.body.email, 
            password : hashedPassword
        }) 
    
    
        try { 
            // storing user in db
            const savedUser = await user.save(); 
            const token = jwt.sign({username : user.name} , process.env.TOKEN_SECRET );
            res.cookie('token',token,{httpOnly:true});
            res.header("Content-Type", "application/json")
            res.status(200);
            var response = new Object();
            response.message = "User Registered successfully";
            response.code = 0;
            res.send(response);
        }catch(err){ 
            var response = new Object();
            response.error = "DatabaseException";
            response.message = err.message;
            res.header("Content-Type", "application/json")
            res.status(500).send(response); 
        } 
    }).catch((err) => {
        var response = new Object();
        response.error = "ValidationException";
        response.message = err.message;
        res.header("Content-Type", "application/json")
        res.status(400).send(response); 
    }); 
}) 
router.post('/login',async (req,res)=>{ 
    loginValidation(req.body).then(async (result) => {
        var token = null;
        const user = await User.findOne({email : req.body.email});
        token = jwt.sign({username : user.name} , process.env.TOKEN_SECRET );
        res.cookie('token',token,{httpOnly :true});
        res.header("Content-Type", "application/json");
        // res.header("Set-Cookie", `token=${token};HttpOnly;Path="/"`)
        // res.header("X-Token", token);
        res.status(200);
        const response = new Object();
        response.message = "Logged In Successfully";
        response.code = 0;
        response.name = user.name;
        res.send(response);
    }).catch((err)=>{
        const response = new Object();
        response.error = "ValidationException";
        response.message = err.message;
        res.header("Content-Type", "application/json")
        console.log(err);
        res.status(400).send(response);
    })
    
})
// router.get('/cookie', (req, res) => {
//     res.cookie("token", "abcd1234", {httpOnly: true});
//     res.send("Sample Cookie")
// })
module.exports = router;