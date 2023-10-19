const mongoose = require('mongoose');
const validator = require('validator');

const candidate_Resume_Schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel' // Reference the UserModel
},
resume_title:{
    type:String,
    required:false
  },
  resume:{
    type:String,
    required:false
  }})
  const resume_Model = mongoose.model('ResumeModel', candidate_Resume_Schema);

  // skill
  const candidate_skill_Schema = mongoose.Schema({  
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserModel' // Reference the UserModel
  },
  skill_name:[{
    type:String,
    required:false
  }]
})
const skill_Model = mongoose.model('SkillModel', candidate_skill_Schema);

// 
const candidate_experience_Schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel' // Reference the UserModel
},
  designation:[{
    type:String,
    required:false
  }],
  organization:[{
    type:String,
    required:false
  }],
  working_start_date:[{
    type:Date,
    required:false
  }],
  working_end_date:[{
    type:Date,
    required:false
  }],
  emp_job_detail:[{
    type:String,
    required:false
  }]
})
const empEx_Model = mongoose.model('EmpexperienceModel', candidate_experience_Schema);
  
// for education
const candidate_edu_Schema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel' // Reference the UserModel
},
  edu_degree:[{
    type:String,
    required:false
  }],
  edu_pass_year:[{
    type:String,
    required:false
  }],
  edu_institute_name:[{
    type:String,
    required:false
  }],
})
const edu_Model = mongoose.model('EducationModel', candidate_edu_Schema);
module.exports ={
resume_Model,
skill_Model,
empEx_Model,
edu_Model
};