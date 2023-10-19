const path = require('path')
const mongoose=require('mongoose')
const userModel = require('../Models/userModel')
const companyModel = require('../Models/companyModel')
const candidateModel = require('../Models/candidate_model')
const categoryModel = require('../Models/job-categoryModel')
const jobModel = require('../Models/jobModel')
const job_applyModel = require('../Models/job_applyModel')
const job_savedModel = require('../Models/saved_jobModel')
const saved_jobModel = require('../Models/saved_jobModel')

const populate_models=['resumeProfile','skillProfile','educationProfile','empExProfile']


const employee_loader = async (req, res) => {
    try {
        const _id = req.decodetoken._id
        const user = await userModel.findById({ _id: _id }).populate(populate_models)
        const total_jobs=await jobModel.countDocuments({user:_id})
        const active_jobs=await jobModel.countDocuments({status:1,user:_id})
        const applied_jobs=await job_applyModel.countDocuments({emp_id:_id})
        const saved_jobs=await saved_jobModel.countDocuments({emp_id:_id})
        console.log('total:',total_jobs)
        console.log('active total:',active_jobs)
        // console.log(`Size of array where status is 1: ${sizeOfActiveStatusArray}`);
        
        // console.log("totalj:",totalJobs.job_title.length)
        res.render('employer-dashboard', { 
            user,
            total_jobs,
            active_jobs,
            applied_jobs,
            saved_jobs
        })
    } catch (error) {
        console.log(error)
    }
}

const profile_loader = async (req, res) => {
    try {
        const _id = req.decodetoken._id
        //  console.log(_id)
        const viewPath = path.join(__dirname, '../Templates/views/employers/profile/profile_view.ejs')
        const user = await userModel.findById({ _id: _id }).populate('companyProfile')

        res.render(viewPath, { user })
    } catch (error) {
        console.log(error)
    }
}


const profile_setting_loader = async (req, res) => {
    try {
        const _id = req.decodetoken._id
        const viewPath = path.join(__dirname, '../Templates/views/employers/profile/profile-setting.ejs')
        const user = await userModel.findById({ _id: _id })

        res.render(viewPath, { user })
    } catch (error) {
        console.log(error)
    }
}
// update Profile


const update_profile = async (req, res) => {
    try {


        const _id = req.body._id;

        if (req.file) {
            // Use req.query to access URL parameters
            const update = await userModel.findByIdAndUpdate({ _id: _id }, {
                $set: {
                    fname: req.body.fname,
                    lname: req.body.lname,
                    profile_photo: req.file.filename,
                    qualification: req.body.qualification,
                    dob: req.body.dob,
                    zip_code: req.body.zip_code,
                    full_address: req.body.full_address,
                    introduction: req.body.introduction
                }
            }, { new: true })
            if (update.role_as == '2') {
                res.redirect('/candidates/candidate-dashboard')
            }
            if (update.role_as == '1') {
                res.redirect('/employers/employer-dashboard')
            }

        }
        if (!req.file) {
            // Use req.query to access URL parameters
            const update = await userModel.findByIdAndUpdate({ _id: _id }, {
                $set: {
                    fname: req.body.fname,
                    lname: req.body.lname,
                    qualification: req.body.qualification,
                    dob: req.body.dob,
                    zip_code: req.body.zip_code,
                    full_address: req.body.full_address,
                    introduction: req.body.introduction
                }
            }, { new: true });
            if (update.role_as == '2') {
                res.redirect('/candidates/candidate-dashboard')
            }
            if (update.role_as == '1') {
                res.redirect('/employers/employer-dashboard')
            }

        }


    } catch (error) {
        console.log(`error in updation: ${error}`);
    }
}
// ................Company Controller Start here____________________________________--->>>

const creat_company_loader = async (req, res) => {
    try {
        const _id = req.decodetoken._id
        const message=''
        const user = await userModel.findById({ _id: _id })
        const viewPath = path.join(__dirname, '../Templates/views/employers/companies/create_company.ejs')
        res.render(viewPath, { user ,message})
    } catch (error) {
        console.log(`error in creation:${error}`)
    }
}
const add_company = async (req, res) => {
    try {
        const _id = req.decodetoken._id
        const message=''
        const user = await userModel.findById({ _id: _id })
        if (!user) {
            res.redirect('/login')
        }
        const user_id=user._id
        const companyMatch=await companyModel.find({user:user_id})
        for(let i=0;i<companyMatch.length;i++){
          
           if(companyMatch[i].comp_name==req.body.comp_name)
           {
            var is_match=req.body.comp_name
           }
        }
       
        
        if(!is_match){
          
            const newCompany = new companyModel({
              
                user:_id,
                comp_name: req.body.comp_name,
                comp_logo: req.file.filename,
                comp_email: req.body.comp_email,
                comp_phone: req.body.comp_phone,
                comp_team_size: req.body.comp_team_size,
                comp_established: req.body.comp_established,
                description: req.body.description,
                full_address: req.body.full_address,
                
                created_at: new Date()
            })
            await newCompany.save()
           
            // console.log('comp:',comp_id)
            // user.companyProfile = comp_id
            // await user.save()
            return res.redirect('/employers/employer-dashboard');
        }
        else{
            
            const viewPath = path.join(__dirname, '../Templates/views/employers/companies/create_company.ejs')
            res.render(viewPath, { user,message:'This name already exist' })
        }
      


    } catch (error) {
        res.send(error)
        console.log(`error in creation company:${error}`)
    }
}

// company list

const company_list_loader = async (req, res) => {
    try {
        const _id = req.decodetoken._id
        const message=''
        const user = await userModel.findById({ _id: _id })
        const user_id=user._id
        const company_Data=await companyModel.find({user:user_id})
        console.log('data:',company_Data)
        // console.log(company_Data[0])
        if (!user) {
            res.redirect('/login')
        }
         if(user){
            const viewPath = path.join(__dirname, '../Templates/views/employers/companies/companies_list.ejs')
            res.render(viewPath, { user,company_Data})
         }
       
       

    } catch (error) {
        console.log(`Error in company's list${error}`)
    }



}
// company status controller
const company_status=async(req,res)=>{
    try
    {
        // Assuming you have the job_id
        const index =req.params.index-1
        const _id=req.decodetoken._id
        const user=await userModel.findById({_id:_id})
        const user_id = user._id
        const company=await companyModel.find({user:user_id})

        const currentStatus = company[index].status;
        const comp_id=company[index]._id
        console.log('compId:',comp_id)
        if (currentStatus === 1) {
         await companyModel.findByIdAndUpdate(
            {_id:comp_id},
            { $set: { status: 0 } },
            { new: true },
          );
          res.redirect('/employers/companies_list')
        }
         else if (currentStatus === 0) {
          await companyModel.findByIdAndUpdate(
            {_id:comp_id},
            { $set: { status: 1 } },
            { new: true },
          );
          res.redirect('/employers/companies_list')
        }
        
}
catch(error)
{
    console.log(`error in status:${error}`)
   }
}
// company detail
const company_detail_loader = async (req, res) => {
    try {

        const index = req.params.index-1;
        const _id = req.decodetoken._id
        const user = await userModel.findById({ _id: _id })
      
        const user_id=user._id
       const companyDetail=await companyModel.find({user:user_id})
      
        if(companyDetail)
        {
            const companyName = companyDetail[index].comp_name;
            const companyId = companyDetail[index]._id;
            const companyLogo = companyDetail[index].comp_logo;
            const companyEstablished = companyDetail[index].comp_established;
            const companyPhone = companyDetail[index].comp_phone;
            const companyEmail = companyDetail[index].comp_email;
            const comp_team_size = companyDetail[index].comp_team_size;
            const description = companyDetail[index].description;
            const created_at = companyDetail[index].created_at;
            const companyAddress = companyDetail[index].full_address;
            const viewPath = path.join(__dirname, '../Templates/views/employers/companies/company_detail.ejs')
            res.render(viewPath, {
                companyId,
                companyName,
                companyLogo,
                companyEstablished,
                companyPhone,
                companyEmail,
                comp_team_size,
                description,
                created_at,
                companyAddress,
                user
            })
        }
        else{
            res.status(400).send('Not found')
        }
    } catch (error) {
        console.log(`Error in detail:${error}`)
    }
}
//////......................... update company
const update_company_loader = async (req, res) => {
    try {
        const index = req.params.index-1;
        const _id = req.decodetoken._id
        const user = await userModel.findById({ _id: _id })
        const user_id=user._id
        const companyData=await companyModel.find({user:user_id})
        // console.log(index)
        if (companyData) {
            if (index >= 0 && index < companyData.length) 
            {
            const updateCompany = companyData[index];

            const companyName = updateCompany.comp_name;
            const companyLogo = updateCompany.comp_logo;
            const companyEstablished = updateCompany.comp_established;
            const companyPhone = updateCompany.comp_phone;
            const companyEmail = updateCompany.comp_email;
            const comp_team_size =updateCompany.comp_team_size;
            const description = updateCompany.description;
            const created_at = updateCompany.created_at;
            const companyAddress = updateCompany.full_address;
            const viewPath = path.join(__dirname, '../Templates/views/employers/companies/update_company.ejs')
            res.render(viewPath, {
                companyName,
                companyLogo,
                companyEstablished,
                companyPhone,
                companyEmail,
                comp_team_size,
                description,
                created_at,
                companyAddress,
                user
            })
           }
        }
        else{
            res.status(404).send('not found user')
        }
    } catch (error) {
        console.log(`Error in update loader:${error}`)
    }
}
// -------editcompany
const update = async (req, res) => {
    try {
        const _id = req.decodetoken._id;
        const index = req.params.index - 1;
        const user = await userModel.findById({ _id: _id });
        const user_id = user._id;
        const comp_update = await companyModel.find({ user: user_id });

        if (comp_update) {
            // Check if the index is within bounds
            if (index >= 0 && index < comp_update.length) {
                const updatedCompany = comp_update[index];

                if(updatedCompany){
                    updatedCompany.comp_name = req.body.comp_name;
                    if(req.file){
                    updatedCompany.comp_logo = req.file.filename;
                    }
                    updatedCompany.comp_email = req.body.comp_email;
                    updatedCompany.comp_phone = req.body.comp_phone;
                    updatedCompany.comp_established = req.body.comp_established;
                    updatedCompany.comp_team_size = req.body.comp_team_size;
                    updatedCompany.full_address = req.body.full_address;
                    updatedCompany.description = req.body.description;
                   var UpdateCompany= await updatedCompany.save();
                }
                

                // Save the updated company document
            }
            if(UpdateCompany){

            res.redirect('/employers/companies_list');
            }
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.log(`error in editing company: ${error}`);
    }
};


// delete commpany..................
const delete_company = async (req, res) => {
    try {
        const _id = req.decodetoken._id;
        const index = req.params.index-1; // Assuming you pass the index as a URL parameter
        const user = await userModel.findById({ _id: _id })
       const user_id=user._id
        // / Step 1: Set the element at the specified index to null
       const company=await companyModel.find({user:user_id})
       const comp_id=company[index]._id
       const delete_company=await CompanyModel.findByIdAndDelete({_id:comp_id},{new:true})
       

       
        if (delete_company) {
          
            res.redirect('/employers/companies_list');

        }
        else{
            res.redirect('/employers/companies_list');
        }

        //  }
    } catch (error) {
        console.error('Error in deleting fields:', error);
        res.status(500).send('Error deleting fields.');
    }
};

// ..........job category controllers..............
const create_category_loader=async(req,res)=>{
    try {
        const viewPath = path.join(__dirname, '../Templates/views/employers/jobs-categories/create_category.ejs')
        const user=''
        const message=''
       res.render(viewPath,{user,message}) 
        
    } catch (error) {
       console.log(`error in category creation:${error}`) 
    }
}

const category_data=async(req,res)=>{
    try {
        const _id=req.decodetoken._id
        const user=await userModel.findById({_id:_id})
        
        if(!user){
            res.redirect('/login')
        }
        const user_id=user._id
        const category=await categoryModel.find({user:user_id})
        if(category)
        {
            for(let i=0;i<category.length;i++)
            {
                if(category[i].category_name==req.body.category_name){
                    var is_match=req.body.category_name
                }
            }
        }
        if(!is_match)
        {
            const new_category=new categoryModel({
                user:_id,
                category_name:req.body.category_name,
                category_image:req.file.filename,
                created_at:new Date(),
            })
            await new_category.save();
            res.redirect('/employers/category_list')
        }
        else{
            const viewPath = path.join(__dirname, '../Templates/views/employers/jobs-categories/create_category.ejs')
        
           res.render(viewPath,{user,message:'This name already taken'})   
        }
       
    } catch (error) {
        console.log(`error in category creation:${error}`) 
    }
}

// category_list_loader
const category_list_loader=async(req,res)=>{
    try {
        const _id=req.decodetoken._id
        const user=await userModel.findById({_id:_id})
        const user_id=user._id
        const category_data=await categoryModel.find({user:user_id})

        const viewPath = path.join(__dirname, '../Templates/views/employers/jobs-categories/category-list.ejs')
       res.render(viewPath,{user,category_data}) 
    } catch (error) {
        console.log(`error in category_list loader:${error}`)  
    }
}
// Edit Category
const edit_category=async(req,res)=>{
    try { 
        const index=req.params.index-1
        const _id=req.decodetoken._id
        const user=await userModel.findById({_id:_id})
        if(!user){
            res.redirect('/login')
        }
        const user_id=user._id
        const category=await categoryModel.find({user:user_id})
         const edit_category=category[index]
        const categoryName=edit_category.category_name
        const categoryImage=edit_category.category_image
        const viewPath = path.join(__dirname, '../Templates/views/employers/jobs-categories/edit-category.ejs')
       res.render(viewPath,{
        user,
        categoryName,
        categoryImage
    }) 

        
    } catch (error) {
        console.log(`Error in edit category:${error}`)
    }
}
const edit_data=async(req,res)=>{
    try { 
        const index=req.params.index-1
        const _id=req.decodetoken._id
        const user=await userModel.findById({_id:_id})
        if(!user){
            res.redirect('/login')
        }
        const user_id=user._id
        const category=await categoryModel.find({user:user_id})
         const edit_category=category[index]
        if(req.file){
            edit_category.category_name=req.body.category_name
            edit_category.category_image=req.file.filename
            await edit_category.save()
        }
        if(!req.file){
            edit_category.category_name=req.body.category_name
         await edit_category.save()
        }
        res.redirect('/employers/category_list')
      

        
    } catch (error) {
        console.log(`Error in edit category:${error}`)
    }
}

const delete_category=async(req,res)=>{
    try {
        const index=req.params.index-1
        const _id=req.decodetoken._id
        const user=await userModel.findById({_id:_id})
        if(!user)
        {
            res.redirect('/login')
        }
        const user_id=user._id
        const category=await categoryModel.find({user:user_id})
        if(category[index])
        {
          const delete_category=category[index]
          const category_id=delete_category._id
          await categoryModel.findByIdAndDelete({_id:category_id})
         res.redirect('/employers/category_list')
        }
        else
        {
            res.status(404).send('Not found')
        }
        
    } catch (error) {
        console.log(`Error in deletion:${error}`)
    }
}

// jobs controller start here______________________


const job_create_loader=async(req,res)=>{
    try {
        const _id=req.decodetoken._id
        const message=''
        const user=await userModel.findById({_id:_id})
        if(!user)
        {
            res.redirect('/login')
        }
       const user_id=user._id
       var company=await companyModel.find({user:user_id})
       
       var category=await categoryModel.find({user:user_id})
       
        const viewPath = path.join(__dirname, '../Templates/views/employers/jobs/create_job.ejs')
        res.render(viewPath,{
            user,
            company,
            category,
            message
        }) 
    } catch (error) {
        console.log(`error in job creat loader:${error}`)
        
    }
}

// job form data submission
const job_create_data=async(req,res)=>{
    try {
        const _id=req.decodetoken._id
        const user=await userModel.findById({_id:_id})
        
        if(!user){
            res.redirect('/login')
        }
        const user_id=user._id
        const company=await companyModel.find({user:user_id})
        for(let i=0;i<company.length;i++)
        {
            var companyName=company[i].comp_name=req.body.company
        }
        const companyData=await companyModel.findOne({comp_name:companyName})
        const comp_id=companyData._id
        const category=await categoryModel.find({user:user_id})
        for(let i=0;i<category.length;i++)
        {
            var categoryName=category[i].category_name=req.body.category
        }
        const categoryData=await categoryModel.findOne({category_name:categoryName})
        const categoryId=categoryData._id
      
        const job=await jobModel.find({user:user_id})
        for(let i=0;i< job.length;i++)
        {
            if(job[i].job_title==req.body.job_title)
            {
                var is_match=req.body.job_title
            }
        }
        //  const job=await jobModel.find()
        if(!is_match)
        {
          const new_job=new jobModel({
          user:_id,
          company_id:comp_id,
          category_id:categoryId,
          job_title:req.body.job_title,
          job_image:req.file.filename,
          category:req.body.category,
          company:req.body.company,
          gender:req.body.gender,
          min_salary:req.body.min_salary,
          max_salary:req.body.max_salary,
          vacancies:req.body.vacancies,
          req_experience:req.body. req_experience,
          req_qualification:req.body. req_qualification,
          state:req.body. state,
          city:req.body.city,
          full_address:req.body. full_address,
          job_close_date:req.body.job_close_date,
          job_tags:req.body.job_tags,
          job_type:req.body.job_type,
          short_description:req.body.short_description,
          description:req.body.description,
          status:1,
          created_at: new Date()
        })
        await new_job.save()
        res.redirect('/employers/jobs-list')
      }
      else{
        const viewPath = path.join(__dirname, '../Templates/views/employers/jobs/create_job.ejs')
        res.render(viewPath,{
        user
        ,message:'Job Name already Taken', 
        company,
        category
        }) 
       }
    } catch (error) {
        console.log(`error in job creation:${error}`)
        
    }
}
// job list loader
const job_list_loader=async(req,res)=>{
    try {
        const _id=req.decodetoken._id
        const user=await userModel.findById({_id:_id})
        const user_id=user._id
        const jobs=await jobModel.find({user:user_id})
        // console.log(`category:${user.categoryProfile.category_name}`)
        const viewPath = path.join(__dirname, '../Templates/views/employers/jobs/jobs_list.ejs')
        res.render(viewPath,{user,jobs}) 
    } catch (error) {
        console.log(`error in job list loader:${error}`)
        
    }
}

// job-status....
const job_status=async(req,res)=>{
    try
    {
        // Assuming you have the job_id
        const index =req.params.index-1
        const _id=req.decodetoken._id
        const user=await userModel.findById({_id:_id})
        const user_id = user._id
        const jobsData=await jobModel.find({user:user_id})
        const job_id = jobsData[index]._id
       
        const currentStatus = jobsData[index].status;
        console.log()
        if (currentStatus === 1) {
         await jobModel.findByIdAndUpdate(
            {_id:job_id},
            { $set: { status: 0 } },
            { new: true },
          );
          res.redirect('/employers/jobs-list')
        }
         else if (currentStatus === 0) {
          await jobModel.findByIdAndUpdate(
            {_id:job_id},
            { $set: { status: 1 } },
            { new: true },
          );
          res.redirect('/employers/jobs-list')
        }
        
}
catch(error)
{
    console.log(`error in status:${error}`)
   }
}

// job detail..........
const job_detail=async(req,res)=>{
    try {
          const _id=req.decodetoken._id
          const job_id=req.params.id
          const index=req.params.index-1
          const user=await userModel.findById({_id:_id})
          if(!user)
          {
            res.redirect('/login')
          }
          const user_id=user._id
          const jobs=await jobModel.findById({_id:job_id})
        //   if(index>=0 && index<=jobs.length)
        //   {
           var comp_Name=jobs.company
        //   }
        //   if(comp_Name){ 
            var companies=await companyModel.findOne({comp_name:comp_Name})
        //   }
          const jobDetail=jobs
          
          const jobTitle=jobDetail.job_title
         
          const jobImage=jobDetail.job_image
          const jobType=jobDetail.job_type
          const Experience=jobDetail.req_experience
          const Vacancies=jobDetail.vacancies
          const Cdate=jobDetail.job_close_date
          const Post_date=jobDetail.created_at
          const State=jobDetail.state
          const City=jobDetail.city
          const Address=jobDetail.full_address
          const Description=jobDetail.description
          const S_Description=jobDetail.short_description
          const MinSalary=jobDetail.min_salary
          const MaxSalary=jobDetail.max_salary
          const Gender=jobDetail.gender
          const Category=jobDetail.category
          const Company=jobDetail.company
          const Comp_Address=companies.full_address
          const Eligibility=jobDetail.req_qualification
          const jobTags=jobDetail.job_tags
          const viewPath = path.join(__dirname, '../Templates/views/employers/jobs/jobs_detail.ejs')
          res.render(viewPath,{
            user,
            jobTitle,
            jobImage,
            jobType,
            Experience,
            Vacancies,
            State,
            City,
            Cdate,
            Post_date,
            Address,
            Description,
            S_Description,
          MinSalary,
          MaxSalary,
          Gender,
          Category,
          Company,
          Eligibility,
          jobTags,
          Comp_Address
        }) 
        
    } catch (error) {
        console.log(`error in detail:${error}`) 
    }
}
// job edit
const job_edit_loader=async(req,res)=>{
    try {
         const index=req.params.index-1
          const _id=req.decodetoken._id
      
          if(!_id){
            res.redirect('/login')
          }
          const user_id=_id
          const jobs=await jobModel.find({user:user_id})
          const categories=await categoryModel.find({user:user_id})
          const companies=await companyModel.find({user:user_id})
          if(jobs)
          {
             if(index>=0 && index<=jobs.length)
                var Edit_job=jobs[index]
            
       
          } 
          else
          {
            res.status(404).send('Not Found')
          }
        const viewPath = path.join(__dirname, '../Templates/views/employers/jobs/edit_jobs.ejs')
        res.render(viewPath,{
            Edit_job,
            index,
            categories,
            companies
        })
    } catch (error) {
        console.log('Error in job Editing:',error)
    }
}
const job_update=async(req,res)=>{
    try {
         const index=req.params.index-1
          const _id=req.decodetoken._id
         console.log('Id:',_id)
          if(!_id){
            res.redirect('/login')
          }
          const user_id=_id
          const jobs=await jobModel.find({user:user_id})
          if(jobs)
          {
              if(index>=0 && index<=jobs.length){
                  var Edit_job=jobs[index]
                }
                
            } 
            else
            {
                res.status(404).send('Not Found')
            }
            if(Edit_job)
            {
            //   console.log("Job:",Edit_job);

             
         
               Edit_job.job_title=req.body.job_title
               if(req.file){
               Edit_job.job_image=req.file.filename}
               Edit_job.category=req.body.category
               Edit_job.company=req.body.company
               Edit_job.gender=req.body.gender
               Edit_job.min_salary=req.body.min_salary
               Edit_job.max_salary=req.body.max_salary
               Edit_job.vacancies=req.body.vacancies
               Edit_job.req_experience=req.body. req_experience
               Edit_job.req_qualification=req.body. req_qualification
               Edit_job.state=req.body. state
               Edit_job.city=req.body.city
               Edit_job.full_address=req.body. full_address
               Edit_job.job_close_date=req.body.job_close_date,
               Edit_job.job_tags=req.body.job_tags
               Edit_job.job_type=req.body.job_type
               Edit_job.short_description=req.body.short_description
               Edit_job.description=req.body.description
          var is_update=await Edit_job.save()
        }  
        if(is_update){
          res.redirect('/employers/jobs-list')
        }  
        // const viewPath = path.join(__dirname, '../Templates/views/employers/jobs/edit_jobs.ejs')
        // res.render(viewPath,{
        //     Edit_job,
        //     index,
        //     categories,
        //     companies
        // })
    } catch (error) {
        console.log('Error in job Updating:',error)
    }
}

// job deletion-------------------->
const job_delete=async(req,res)=>{
    try {
        const _id=req.decodetoken._id
        const index=req.params.index-1
        const jobs=await jobModel.find({user:_id})
        if(jobs)
        {
            var job_Delete=await jobModel.findByIdAndDelete({_id:jobs[index]._id})
        }
        if(job_Delete)
        {
            res.redirect('/employers/jobs-list') 
        }
        
    } catch (error) {
        console.log('Error in job deletion:',error)
    }
}


// job applied and saved controllers=========>>>>
const applied_job_loader=async(req,res)=>{
    try {
        const _id=req.decodetoken._id

        
        const applied_Jobs=await job_applyModel.find({emp_id:_id})
        // const jobs=await jobModel.find({user:_id})
        // const employer=await userModel.find({_id:_id})
        let applied_jobs=[]
        for(let i=0;i<applied_Jobs.length;i++)
        {  
             const job_id=applied_Jobs[i].job_id
          const ca_id=applied_Jobs[i].candidate_id
           const emp_id=applied_Jobs[i].emp_id
           const comp_id=applied_Jobs[i].company_id
           const categ_id=applied_Jobs[i].category_id
           const jobs=await jobModel.findById({_id:job_id})
           const companies=await companyModel.findById({_id:comp_id})
           const categories=await categoryModel.findById({_id:categ_id})
           const candidates=await userModel.findById({_id:ca_id})
          
           const employers=await userModel.findById({_id:emp_id})
           if(jobs && companies && categories && candidates && employers)
           {
              const applied_data=
              {  
                job_id:applied_Jobs[i].job_id,
                _id:applied_Jobs[i]._id,
                job_name:applied_Jobs[i].job_name,
                apply_at:applied_Jobs[i].apply_at,
                status:applied_Jobs[i].status,
                 job_image:jobs.job_image,
                comp_name:companies.comp_name,
                category_name:categories.category_name,

                lname:employers.lname,
                lname:candidates.lname
             

              }
              applied_jobs.push(applied_data)
           }

        }
        const viewPath = path.join(__dirname, '../Templates/views/employers/jobs/applied_jobs.ejs')
        
        res.render(viewPath,{
            applied_jobs,
            // jobs,
            // employer
        })
    } catch (error) {
        console.log('Error in applied loader:',error)
    }
}

// candidates///Applicants
const applicants_loader = async (req, res) => {
    try {
      const j_id = req.query.id;
      const applicant = await job_applyModel.find({ job_id: j_id });
  
      const applicantsWithData = [];
  
      // Fetch user data for each applicant and attach it to a new array
      for (let i = 0; i < applicant.length; i++) {
        const ca_id = applicant[i].candidate_id;
        const candi = await userModel.findById(ca_id).exec();
        const resumeFile=await candidateModel.resume_Model.findOne({user:ca_id})
        // console.log('resume:',resumeFile)
        var applicantData={}
        if (candi) {
            if(resumeFile){
          applicantData = {
            job_name: applicant[i].job_name,
            _id: applicant[i]._id,
            job_id: applicant[i].job_id,
            apply_at: applicant[i].apply_at,
            status: applicant[i].status,
            candidate_id:applicant[i].candidate_id,
            lname: candi.lname,
            email: candi.email,
            phone: candi.phone,
            resume_title:resumeFile.resume_title,
            resume:resumeFile.resume,
          };
        //   applicantsWithData.push(applicantData);
        }
        else{
             applicantData = {
                job_name: applicant[i].job_name,
                _id: applicant[i]._id,
                job_id: applicant[i].job_id,
                apply_at: applicant[i].apply_at,
                status: applicant[i].status,
                candidate_id:applicant[i].candidate_id,
              
                lname: candi.lname,
                email: candi.email,
                phone: candi.phone,
                resume:''
               
              };
            }
            applicantsWithData.push(applicantData);
        }
      }
  
      const viewPath = path.join(__dirname, '../Templates/views/employers/jobs/applicants.ejs');
  
      res.render(viewPath, {
        applicants: applicantsWithData,
        userModel
      });
    } catch (error) {
      console.log('Error in applicants loader:', error);
    }
  };
//   con

const changeStatusController = async (req, res) => {
    try {
      
        const job_id=req.body.job_id
        const _id=req.body._id
        console.log('jid:',_id)
        const ca_id=req.body.cand_id
        const status=req.body.status
        console.log('ca:',ca_id)
       
       const update=await job_applyModel.findOneAndUpdate({_id:_id,candidate_id:ca_id}, {$set:{status:status}},{new:true});
        //  console.log('up:',update)
        // Respond with a success status
        res.redirect(`/employers/job-applicants?id=${job_id}`)
        // return res.status(200).json({ status: 200, message: 'Status changed successfully' });
    } catch (error) {
        console.error('Error changing status:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
};

// candidate profile..............
const candidate_profile=async(req,res)=>{
    try {
          const ca_Id=req.params.ca_id
          const candidate=await userModel.findById({_id:ca_Id})
          let Resume=await candidateModel.resume_Model.findOne({user:ca_Id})
          let skill=await candidateModel.skill_Model.findOne({user:ca_Id})
          let edu=await candidateModel.edu_Model.findOne({user:ca_Id})
          let empExp=await candidateModel.empEx_Model.findOne({user:ca_Id})
        
          const viewPath = path.join(__dirname, '../Templates/views/employers/profile/candidate_profile.ejs');
       
          if(candidate)
          {
            if(!skill)
            {
                skill=''
            }
            if(!Resume)
            {
                Resume=''
            }
            if(!edu)
            {
                edu=''
            }
            if(!empExp)
            {
                empExp=''
            }
            res.render(viewPath, {
             candidate,
             Resume,
             skill,
             edu,
             empExp
            });
          }
    } catch (error) {
        console.log('error in profile loader:',error)
    }
}
// saved jobs.................................>
const saved_jobs=async(req,res)=>{
    try {

          const empId=req.decodetoken._id
          const saved_Jobs=await job_savedModel.find({emp_id:empId})
          var saved_jobs=[]
          if(saved_Jobs)
          {
              for(let i=0;i<saved_Jobs.length;i++)
              {
                let company=await companyModel.findById({_id:saved_Jobs[i].company_id})
                let category=await categoryModel.findById({_id:saved_Jobs[i].category_id})
                  let job=await jobModel.findById({_id:saved_Jobs[i].job_id})
                let candidate=await userModel.findById({_id:saved_Jobs[i].candidate_id})
                  let saved_jobs_data={}
                  if(!company)
                  {
                    company=''
                  }
                  if(!category)
                  {
                    category=''
                  }
                  if(!job)
                  {
                    job=''
                  }
                  if(!candidate)
                  {
                    
                    candidate=''
                  }
                  else
                  {

                     saved_jobs_data=
                     {
                              job_id:saved_Jobs[i].job_id,
                              candidate_id:saved_Jobs[i].candidate_id,
                              job_name:saved_Jobs[i].job_name,
                              job_image:job.job_image,
                              job_type:job.job_type,
                              category_name:category.category_name,
                              comp_name:company.comp_name
                     }
                    }
                    saved_jobs.push(saved_jobs_data)
              }

          }


        const viewPath = path.join(__dirname, '../Templates/views/employers/jobs/saved_jobs.ejs');
        res.render(viewPath,{
            saved_jobs
        })
    } catch (error) {
        console.log('Error in saved jobs:',error)
    }
}
module.exports = {
    employee_loader,
    profile_loader,
    profile_setting_loader,
    update_profile,
    // company
    creat_company_loader,
    add_company,
    company_status,
    company_list_loader,
    company_detail_loader,
    update_company_loader,
    update,
    delete_company,
    // category controller
    create_category_loader,
    category_data,
    category_list_loader,
    edit_category,
    edit_data,
    delete_category,
    // job controllers___________

    job_create_loader,
    job_list_loader,
    job_create_data,
    job_status,
    job_detail,
    job_edit_loader,
    job_update,
    job_delete,
    // applied and saved controllers
    applied_job_loader,
    applicants_loader,
    changeStatusController ,
    // candidate profile----->
    candidate_profile,

    // saved jobs----->
    saved_jobs
}