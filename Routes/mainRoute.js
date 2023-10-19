const express=require('express')

const job_controllers=require('../Controllers/mainController')

const job_Route=express()

const cookie_parser=require('cookie-parser')

job_Route.use(cookie_parser())

const ejs=require('ejs')

const path=require('path')

const viewpath=path.join(__dirname,'../Templates/views')

job_Route.set('view engine','ejs')

job_Route.set('views',viewpath)

job_Route.get('/',job_controllers.index_loader)

job_Route.get('/candidates',job_controllers.candidates_list_loader)

job_Route.get('/candidate-profile/:_id',job_controllers.candidate_profile_loader)

job_Route.get('/employers',job_controllers.employers_list_loader)

job_Route.get('/employer-profile/:index',job_controllers.employer_profile_loader)

job_Route.get('/jobs',job_controllers.listJobs)
job_Route.get('/load-filters-jobs',job_controllers.filterJobs)
job_Route.get('/load-jobs',job_controllers.loadMoreJobs)

job_Route.get('/job-detail',job_controllers. job_detail_loader)

job_Route.get('/category-jobs/:id',job_controllers. job_category_loader)
job_Route.get('/company-jobs/:id',job_controllers. job_company_loader )
// pages------------->
job_Route.get('/about-us',job_controllers. about_us_loader )
job_Route.get('/contact-us',job_controllers. contact_us_loader )
job_Route.get('/faq',job_controllers.faq_loader )

module.exports=job_Route
