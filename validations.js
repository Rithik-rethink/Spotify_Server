const Joi = require('@hapi/joi');
const User = require('./models/User.js'); 
const bcrypt = require('bcrypt');

const RegisterValidations = (data) =>{
    const RegisterSchema = Joi.object({
        name: Joi.string()
            .min(6)
            .required(),
        email: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return new Promise(async function(resolve, reject) {
        var validatedObject = RegisterSchema.validate(data);
        if(!validatedObject.error) {
            const emailexists = await User.findOne({email : data.email});
            if(emailexists){
                reject(new Error("Email exists"));
            }
            const username_exists = await User.findOne({name : data.name});
            if(username_exists){
                reject(new Error("Username exists"));
            }
            resolve("Validation Successful");
        }
        else {
            reject(new Error(validatedObject.error.details[0].message));
        }
    });
}

const loginValidation = (data) => {
    const loginSchema = Joi.object({
        email: Joi.string()
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return new Promise(async (resolve , reject)=>{
        const validatedObject2 = loginSchema.validate(data);
        if(!validatedObject2.error){
            const user = await User.findOne({email : data.email});
            if(!user){
                reject(new Error("Email or password is wrong"));
            }
            const passexists = await bcrypt.compare(data.password ,user.password);
            if(!passexists){
                reject(new Error("Wrong Password"));
            }
            resolve("Validation Successful");
        }
        else{
            reject(new Error(validatedObject2.error.details[0].message));
        }
    })
}
module.exports.RegisterValidations = RegisterValidations;
module.exports.loginValidation = loginValidation;