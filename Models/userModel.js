const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({

    fname: {
        type: String,
        required: true,
        validate(val) {
            if (validator.isNumeric(val)) {
                throw new Error("First name can't be numeric");
            }
        }
    },
    lname: {
        type: String,
        required: true,
        validate(val) {
            if (validator.isNumeric(val)) {
                throw new Error("Last name can't be numeric");
            }
        }
    },
    phone: {
        type: String,
        required: true
      
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cpassword: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    role_as:{
        type:String, // Date of Birth field
        required: true
        // enum:['']
    },
    // fields that will used for profile updation
    profile_photo: {
        type: String, // You can store the path or URL to the photo
     // This field can be optional for profile updates
      },
      qualification: {
        type: String,
        
      },
      dob: {
        type: Date,
        
      },
      zip_code: {
        type: String,
        required: false
      },
      full_address: {
        type: String,
        required: false
      },
      introduction: {
        type: String,
        required: false
      },
     
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    resumeProfile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ResumeModel' // Reference the CandidateModel
    },
    skillProfile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SkillModel' // Reference the CandidateModel
    },
    empExProfile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EmpexperienceModel' // Reference the CandidateModel
    },
    educationProfile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'EducationModel' // Reference the CandidateModel
    },
    companyProfile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company' // Reference the CandidateModel
    },
    categoryProfile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job-category' // Reference the CandidateModel
    },
    jobProfile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job' // Reference the CandidateModel
    },
    jobApplyProfile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobApplication' // Reference the CandidateModel
    }
});

const userModel = mongoose.model('UserModel', userSchema);
module.exports = userModel;
