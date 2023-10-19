const userModel=require('../Models/userModel')
const jobModel=require('../Models/jobModel')
const companyModel=require('../Models/companyModel')
const categoryModel=require('../Models/job-categoryModel')
const applyModel=require('../Models/job_applyModel')
const saveModel=require('../Models/saved_jobModel')
const candidate_Model=require('../Models/candidate_model')
const populate_models = ['skillProfile', 'resumeProfile','educationProfile','empExProfile']
const { use } = require('../Routes/candidateRoutes')
const path=require('path')
const fs = require('fs');
const { model } = require('mongoose');
const { time } = require('console');


const candidate_loader=async(req,res)=>{
    try {
        const _id= req.decodetoken._id
        const user=await userModel.findById({_id:_id}).populate(populate_models)

        const apply_job=await applyModel.find({candidate_id:_id}).countDocuments()
        
        const save_job=await saveModel.find({candidate_id:_id}).countDocuments()
        const CaResCount=await candidate_Model.resume_Model.find({user:_id}).countDocuments()
        if(user && user.skillProfile && user.educationProfile &&user.empExProfile){
       
        const CaSkillCount=user.skillProfile.skill_name.length
        
        const CaEduCount=user.educationProfile.edu_degree.length
     
        const CaEmpCount=user.empExProfile.designation.length
       
        let count=CaSkillCount+CaEduCount+CaEmpCount
        let tcount=CaSkillCount+CaEduCount+CaEmpCount+CaResCount
        
        res.render('candidate_dashboard',{
            user,
            apply_job,
            CaSkillCount,
            CaEduCount,
            CaEmpCount,
            count,
            tcount,
            save_job,
            CaResCount
        })
        }
        else{
            res.render('candidate_dashboard',{
                user,
                apply_job,
                CaSkillCount:'',
                CaEduCount:'',
                CaEmpCount:'',
                count:'',
                tcount:'',
                save_job,
                CaResCount:''
            }) 
        }    
    } catch (error) {
        console.log(error)
    }
}


const profile_loader=async(req,res)=>{
    try {
         const _id=req.decodetoken._id
        //  console.log(_id)
        const viewPath=path.join(__dirname,'../Templates/views/candidates/profile/profile-view.ejs')
        const user=await userModel.findById({_id:_id})
      
        res.render(viewPath,{user})
    } catch (error) {
        console.log(error)
    }
}


const profile_setting_loader=async(req,res)=>{
    try {
        const _id = req.decodetoken._id
        const viewPath=path.join(__dirname,'../Templates/views/candidates/profile/profile-setting.ejs')
        const user=await userModel.findById({_id:_id})
        
        res.render(viewPath,{user})
    } catch (error) {
        console.log(error)
    }
}


const resume_loader=async(req,res)=>{
    try {
        const _id=req.decodetoken._id
    //    const date=new Date()
    //   console.log('date',date.toISOString('T17:25:51.471Z'))

        const viewPath=path.join(__dirname,'../Templates/views/candidates/resume/manage-resume.ejs')
        const user=await userModel.findById({_id:_id}).populate('resumeProfile').populate('skillProfile').populate('empExProfile').populate('educationProfile')
       
        const notificationType=req.query.notification
        res.render(viewPath,{user,notificationType})
       
    } catch (error) {
        console.log(error)
    }
}


const update_profile =async(req,res)=>{
    try {
       

        const _id = req.body._id; 
       
        if(req.file){
        // Use req.query to access URL parameters
         const update = await userModel.findByIdAndUpdate({_id:_id},{$set:{
            fname:req.body.fname,
            Iname:req.body.Iname,
            profile_photo:req.file.filename,
            qualification:req.body.qualification,
            dob:req.body.dob,
            zip_code:req.body.zip_code,
            full_address:req.body.full_address,
            introduction:req.body.introduction
        }},{new:true})
        if(update.role_as=='2'){
            res.redirect('/candidates/candidate-dashboard')
        }
        if(update.role_as=='1'){
            res.redirect('/employers/employer-dashboard')
        }
         
      } 
        if(!req.file){
        // Use req.query to access URL parameters
         const update = await userModel.findByIdAndUpdate({_id:_id},{$set:{
            fname:req.body.fname,
            Iname:req.body.Iname,
            qualification:req.body.qualification,
            dob:req.body.dob,
            zip_code:req.body.zip_code,
            full_address:req.body.full_address,
            introduction:req.body.introduction
        }},{new:true});
         if(update.role_as=='2'){
            res.redirect('/candidates/candidate-dashboard')
        }
        if(update.role_as=='1'){
            res.redirect('/employers/employer-dashboard')
        }
       
      } 
       
      
    } catch (error) {
        console.log(`error in updation: ${error}`);
    }
}

const upload_resume = async (req, res) => {
    try {
        const userId = req.decodetoken._id;
     
        const user = await userModel.findById(userId).populate('resumeProfile');
        if (!user) {
            // Handle the case where user doesn't exist
            return res.redirect('/login'); // Redirect to login or error page
        }
        //  const is_Resume=await 
        if (!user.resumeProfile && !user.resume_title) {
            // If user doesn't have a candidate profile, create one
            const newCandidate = new candidate_Model.resume_Model({
                user: userId,
                resume_title: req.body.resume_title,
                resume: req.file.filename
            });
            user.resumeProfile =newCandidate._id;
            await user.save();
            const saveResume = await newCandidate.save();
            return res.redirect('/candidates/manage-resume');
        } 
       else if(user.resumeProfile.resume_title){
            // Update the existing candidate profile with new resume details
            const resume_Profile = user.resumeProfile; // Access the first candidate profile in the array
            await user.save();
            resume_Profile.resume_title=req.body.resume_title;
            resume_Profile.resume=req.file.filename;
            await resume_Profile.save();

            // Redirect to manage-resume with a success notification
            return res.redirect('/candidates/manage-resume?notification=success');
        }
    } catch (error) {
        console.log(`Error uploading resume: ${error}`);
        // Handle the error, e.g., redirect to an error page
        return res.redirect('/error');
    }
};


const add_skill = async (req, res) => {
    try {
        const userId = req.decodetoken._id;
        const user = await userModel.findById(userId).populate('skillProfile');
        // console.log('skill->:',user)
        if (!user) {
            // Handle the case where user doesn't exist
            return res.redirect('/login'); // Redirect to login or error page
        }

        if (!user.skillProfile && !user.skill_name) {
            // If user doesn't have a candidate profile, create one
                const newCandidate = new candidate_Model.skill_Model({
                user: userId,
                skill_name: req.body.skill_name,
                // resume: req.file.filename
            });
            user.skillProfile= newCandidate._id;
            await user.save();
            const saveSkill = await newCandidate.save();
            return res.redirect('/candidates/manage-resume');
        } 
        if(user.skillProfile.skill_name){
            // Update the existing candidate profile with new resume details
            const skill_Profile = user.skillProfile; // Access the first candidate profile in the array
            skill_Profile.skill_name.push(req.body.skill_name);
          
            await user.save();
            const saveSkill = await skill_Profile.save();

           return res.redirect('/candidates/manage-resume?notification=201');
        } 
    } catch (error) {
        console.error(`Error in adding skill: ${error}`);
        return res.redirect('/error');
    }
};

const add_employee_experience=async(req,res)=>{
    try {
          const userId=req.decodetoken._id
       
          const user=await userModel.findById({_id:userId}).populate('empExProfile')
          
          if(!user){
            return res.redirect('/login')
          }
          if(!user.empExProfile)
          {
             const Emp_exp_=new candidate_Model.empEx_Model({
                user:userId,
                designation:req.body.designation,
                organization:req.body.organization,
                working_start_date:req.body.working_start_date,
                working_end_date:req.body.working_end_date,
                emp_job_detail:req.body.emp_job_detail
             })    
             user.empExProfile=Emp_exp_._id
             await user.save()
             await Emp_exp_.save()
             return res.redirect('/candidates/manage-resume?notification=added')
          }
          if(user.empExProfile){
          const emp_experience=user.empExProfile
          emp_experience.designation.push(req.body.designation)
          emp_experience.organization.push(req.body.organization)
          emp_experience.working_start_date.push(req.body.working_start_date)
          emp_experience.working_end_date.push(req.body.working_end_date)
          emp_experience.emp_job_detail.push(req.body.emp_job_detail)
          await emp_experience.save()
          await user.save()
          return res.redirect('/candidates/manage-resume?notification=added');
        }
    } catch (error) {
      console.log(`error in emp exe ${error}`)  
    }
}
const add_education=async(req,res)=>{
    try {
        const userId=req.decodetoken._id
        const user=await userModel.findById({_id:userId}).populate('educationProfile')
        if(!user){
            return res.redirect('/login')
        }
        if(!user.educationProfile){
            const candi_education=new candidate_Model.edu_Model({
                user:userId,
                edu_degree:req.body.edu_degree,
                edu_pass_year:req.body.edu_pass_year,
                edu_institute_name:req.body.edu_institute_name
            })
            user.educationProfile=candi_education._id
            await user.save();
            await candi_education.save()
            return res.redirect('/candidates/manage-resume?notification=edu_added')
        }
        if(user.educationProfile){
        const candidate_edu=user.educationProfile
        candidate_edu.edu_degree.push(req.body.edu_degree)
        candidate_edu.edu_pass_year.push(req.body.edu_pass_year)
        candidate_edu.edu_institute_name.push(req.body.edu_institute_name)
        await candidate_edu.save();
        await user.save()
        return res.redirect('/candidates/manage-resume?notification=edu_added')
        }
    } catch (error) {
       console.log(`error in adding edu:${error}`) 
    }
}

// jobs controllers start here------->

const applied_job_loader=async(req,res)=>{
    try {
        const _id=req.decodetoken._id
        const applied_jobs=await applyModel.find({candidate_id:_id})
       
        const jobs=await jobModel.find()
       const employer=await userModel.find({role_as:'1'})
      
        const viewPath=path.join(__dirname,'../Templates/views/candidates/jobs/applied_job.ejs')
        res.render(viewPath,{
            applied_jobs,
          
            jobs,
            employer
        
        })
    } catch (error) {
        console.log(`error in applied loader:${error}`)
    }
}

// job details...
const applied_job_detail=async(req,res)=>{
    try {
        const _id=req.params.id
        console.log('id:',_id)
        const job=await jobModel.findById({_id:_id})
        const c_id=job.company_id
        const company=await companyModel.findById({_id:c_id})
        console.log('jobs:',job.job_title)
        const viewPath=path.join(__dirname,'../Templates/views/candidates/jobs/job_detail.ejs')
        res.render(viewPath,{
            job,
            company
        
        })
    } catch (error) {
        console.log('Error in deatil controller:',error)
    }
}

// employer Profile...------>
const employer_profile=async(req,res)=>{
    try {
        const emp_id=req.params.id
        const employer=await userModel.findById({_id:emp_id})
        
        const companies=await companyModel.find({user:emp_id})
        const viewPath=path.join(__dirname,'../Templates/views/candidates/profile/employee-profile.ejs')
        res.render(viewPath,{
           employer,
           companies
        
        })
        
    } catch (error) {
        console.log('Error in profile loading:',error)
    }
}


// saved jobs by candidates
const saved_jobs=async(req,res)=>{
    try {
        const _id=req.decodetoken._id
        const saved_jobs=await saveModel.find({candidate_id:_id})
        const companies=await companyModel.find()
        const categories=await categoryModel.find()
        const jobs=await jobModel.find()
       const employer=await userModel.find({role_as:'1'})
       
        const viewPath=path.join(__dirname,'../Templates/views/candidates/jobs/saved_jobs.ejs')
        res.render(viewPath,{
            saved_jobs,
            companies,
            categories,
            jobs,
            employer
        
        })
    } catch (error) {
        console.log(`error in applied loader:${error}`)
    }
}
module.exports={
    candidate_loader,
    profile_loader,
    profile_setting_loader,
    resume_loader,
    update_profile,
    upload_resume ,
    add_skill,
    add_employee_experience,
    add_education,

    // jobs controllers----
    saved_jobs,
    applied_job_loader,
    applied_job_detail,

    // employer profile
    employer_profile
}