const express=require('express')
const path=require('path')
const candidate_Route=express()
const validatorError=require('../Middleware/handleValidationErrors')
candidate_Route.use(express.json())
candidate_Route.use(express.urlencoded({extended:true}))
const cookie_parser=require('cookie-parser')
candidate_Route.use(cookie_parser())

const candidate_controllers=require('../Controllers/Candidate_controller')

const authentication=require('../Middleware/authentication')
candidate_Route.use(express.static(path.join(__dirname,'public')))
const pug=require('ejs')


const viewpath=path.join(__dirname,'../Templates/views/candidates')

candidate_Route.set('view engine','ejs')

candidate_Route.set('views',viewpath)
// multer here
const multer=require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        // console.log(file);
        cb(null,path.join(__dirname,'../public/db_assets/p-images'))
    },
    filename:(req,file,cb)=>{
        const extname=Date.now()+''+file.originalname;
        cb(null,extname)
    }
})
const upload=multer({storage:storage})
// resume___
const resume_storage = multer.diskStorage({
    destination: function (req, file, cb){
        // console.log(file);
        cb(null,path.join(__dirname,'../public/db_assets/pdf_files'))
    },
    filename:(req,file,cb)=>{
        const extname=Date.now()+''+file.originalname;
        cb(null,extname)
    }
})
const upload_resume=multer({storage:resume_storage})

candidate_Route.get('/candidate-dashboard',authentication.is_login,candidate_controllers.candidate_loader)

candidate_Route.get('/profile',authentication.is_login,candidate_controllers.profile_loader)

candidate_Route.get('/profile-setting',authentication.is_login,candidate_controllers.profile_setting_loader)

candidate_Route.get('/manage-resume',authentication.is_login,candidate_controllers.  resume_loader)

candidate_Route.post('/profile-setting',upload.single('profile_photo'),candidate_controllers.update_profile)

candidate_Route.post('/upload-resume',authentication.is_login, upload_resume.single('resume'),candidate_controllers.upload_resume);

candidate_Route.post('/add-skill',authentication.is_login,candidate_controllers.add_skill);

candidate_Route.post('/add-emp-experience',authentication.is_login,candidate_controllers.add_employee_experience);

candidate_Route.post('/add-education',authentication.is_login,candidate_controllers.add_education);

// job routes---->
candidate_Route.get('/saved-jobs',authentication.is_login,candidate_controllers.saved_jobs)

candidate_Route.get('/applied-jobs',authentication.is_login,candidate_controllers.applied_job_loader)

candidate_Route.get('/job-detail/:id/:index',authentication.is_login,candidate_controllers.applied_job_detail)

candidate_Route.get('/emp-profile/:id/:index',authentication.is_login,candidate_controllers.employer_profile)
module.exports=candidate_Route
