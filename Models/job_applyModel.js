const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  candidate_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel', // Reference to the User model (for candidates)
    required: true,
  },
  emp_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel', // Reference to the Job model
    required: true,
  },
  emp_name:{
    type:String,
    required:true
  },
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel', // Reference to the Job model
    required: true,
  },
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel', // Reference to the Job model
    required: true,
  },
  comp_name:{
      type:String,
      required:true
  },
  category_name:{
    type:String,
    required:true
  },
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Reference to the Job model
    required: true,
  },
  job_name: {
    type: String,
    required: true,
  },
  apply_at: {
    type: Date,
    required: true,
  },
  status:{
    type:Number,
    default:1
  }
 
  // Add any other fields you need for the application
  // (e.g., application status, application date, etc.)
});

// Create a compound unique index for candidate_id, job_name, and index fields


module.exports = mongoose.model('JobApplication', jobApplicationSchema);
