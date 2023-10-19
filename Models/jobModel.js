const mongoose = require('mongoose')
const job_Schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'userModel'

    },
    company_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Company'

    },
    category_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Job-category'

    },
    job_title:{
        type: String,

    },
    job_image:{
        type: String,

    },
    category:{
        type: String,

    },
    company:{
        type: String,

    },
    gender:{
        type: String,

    },
    job_type:{
        type: String,

    },
    min_salary:{
        type: Number,

    },
    max_salary:{
        type: Number,

    },
    vacancies: {
        type: Number,

    },
    req_experience: {
        type: String,

    },
    req_qualification:{
        type: String,

    },
    state:{
        type: String,

    },
    city:{
        type: String,

    },
    full_address:{
        type: String,

    },
    job_close_date:{
        type:Date,

    },
    job_tags: {
        type: String,

    },
    short_description:{
        type: String,

    },
    description:{
        type: String,

    },
    status:{
        type:Number
       

    },
    created_at:{
        type:Date,
        default:Date.now
    },
   
    jobApplyProfile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobApplication' 
    }
})
module.exports = new mongoose.model('Job', job_Schema)
