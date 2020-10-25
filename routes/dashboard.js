const router = require('express').Router();
const verify = require('./verification.js');
const User = require('../models/User.js'); 
const jwt = require('jsonwebtoken');

router.get('/dashboard',verify,(req,res)=>{
    const token = req.header('Cookie').split(';')[0].split('=')[1];
    const username = jwt.decode(token).username;
    const response = new Object();
    response.message = "Verified";
    response.code = 0;
    response.name = username;
    res.status(200);
    res.send(response);
    
})


module.exports = router;