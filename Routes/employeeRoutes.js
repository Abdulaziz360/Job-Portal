const express=require('express')

const employee_controllers=require('../Controllers/Employee_controller')

const employee_Route=express()

const authentication=require('../Middleware/authentication')
const cookie_parser=require('cookie-parser')
employee_Route.use(cookie_parser())

const multer=require('multer')
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/db_assets/p-images'))
    },
    filename:function(req,file,cb){
        const name=Date.now()+''+file.originalname;
         cb(null,name)
    }
})
const upload=multer({storage:storage})

// logo.......
// const comp_logo=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,path.join(__dirname,'../public/db_assets/p-images'))
//     },
//     filename:function(req,file,cb){
//         const name=Date.now()+''+file.originalname;
//          cb(null,name)
//     }
// })
// const upload_logo=multer({storage:comp_logo})
const path=require('path')
const viewpath=path.join(__dirname,'../Templates/views/employers')
employee_Route.set('view engine','ejs')
employee_Route.set('views',viewpath)
employee_Route.get('/employer-dashboard',authentication.is_login,employee_controllers.employee_loader)
employee_Route.get('/profile',authentication.is_login,employee_controllers.profile_loader)
employee_Route.get('/profile-setting',authentication.is_login,employee_controllers.profile_setting_loader)
employee_Route.post('/profile-setting',upload.single('profile_photo'),employee_controllers.update_profile)

// company route here------->
employee_Route.get('/company_create',authentication.is_login,employee_controllers.creat_company_loader);

employee_Route.post('/company_create',authentication.is_login,upload.single('comp_logo'),employee_controllers.add_company);

employee_Route.get('/companies_list',authentication.is_login,employee_controllers. company_list_loader);

employee_Route.get('/company-status/:index',authentication.is_login,employee_controllers.company_status)

employee_Route.get('/company-detail/:index',authentication.is_login,employee_controllers.company_detail_loader);


employee_Route.get('/company-edit/:index',authentication.is_login,employee_controllers.update_company_loader);
employee_Route.get('/company-delete/:index',authentication.is_login,employee_controllers.delete_company);


employee_Route.post('/company-edit/:index',authentication.is_login,upload.single('comp_logo'),employee_controllers.update);

// job-category.....
employee_Route.get('/job-category-create',authentication.is_login,employee_controllers.create_category_loader)
employee_Route.post('/job-category-create',authentication.is_login,upload.single('category_image'),employee_controllers. category_data)

employee_Route.get('/category_list',authentication.is_login,employee_controllers.category_list_loader)

employee_Route.get('/job-category-edit/:index',authentication.is_login,employee_controllers.edit_category)

employee_Route.post('/job-category-edit/:index',authentication.is_login,upload.single('category_image'),employee_controllers.edit_data)


employee_Route.get('/job-category-delete/:index',authentication.is_login,employee_controllers.delete_category)
// job routes...........
employee_Route.get('/job-create',authentication.is_login,employee_controllers.job_create_loader)


employee_Route.post('/job-create',authentication.is_login,upload.single('job_image'),employee_controllers.job_create_data)

employee_Route.get('/jobs-list',authentication.is_login,employee_controllers.job_list_loader)

employee_Route.get('/job-status/:index',authentication.is_login,employee_controllers.job_status)

employee_Route.get('/job-detail/:id/:index',authentication.is_login,employee_controllers.job_detail)

employee_Route.get('/job-edit/:index',authentication.is_login,employee_controllers.job_edit_loader)

employee_Route.get('/job-delete/:index',authentication.is_login,employee_controllers.job_delete)


employee_Route.post('/job_update/:index',authentication.is_login,upload.single('job_image'),employee_controllers.job_update)

employee_Route.get('/applied-jobs',authentication.is_login,employee_controllers.applied_job_loader)

employee_Route.get('/job-applicants',authentication.is_login,employee_controllers.applicants_loader)

employee_Route.post('/apply-job-status',authentication.is_login,employee_controllers. changeStatusController )

employee_Route.get('/candidate-profile/:ca_id',authentication.is_login,employee_controllers. candidate_profile)

employee_Route.get('/saved-jobs',authentication.is_login,employee_controllers.saved_jobs)
module.exports=employee_Route
