const express = require('express');
const userModel = require('../Models/userModel');
const candidate_Model = require('../Models/candidate_model');
const validator = require('validator');

const validatorError = async (req, res, next) => {
    try {
        const { fname, lname, email, phone, password, cpassword, gender ,role_as}= req.body; // Extract the "gender" field
        const error ='';
        const message=''
        if (!/^[a-zA-Z]+$/.test(fname)) {
            error.fname = 'This field can only contain alphabetic characters';
        }

        if (!/^[a-zA-Z]+$/.test(lname)) {
            error.lname = 'This field can only contain alphabetic characters';
        }
        if (!validator.isEmail(email)) {
            error.email = 'Invalid email';
        }
        
        const exist_email = await userModel.findOne({ email });
        if (exist_email) {
            error.emailExist = 'Email already exists';
        }
        
        // const exist_resume = await candidate_Model.findOne({resume});
        // // if (exist_resume) {
        // //     error.exist_resume = 'already exists';
        // // }
        
        if (!validator.isNumeric(phone)) {
            error.phone = 'This field only takes numeric values';
        }
        if (password.length < 8) {
            error.password = 'Password must be at least 8 characters';
        }
        if (!gender) {
            error.gender = 'gender is required';
        }
        
        if (!role_as) {
            error.role_as = 'is required';
        }
        
        if (Object.keys(error).length > 0) {

            // If there are errors, render the register view with error messages
            return res.render('registration', { error, message });
        }
        
        // If no errors, proceed to the next middleware
        next();
    } catch (error) {
        console.log(`error in middleware:${error}`)
        res.send('Middleware error');
    }
};

module.exports = validatorError;
