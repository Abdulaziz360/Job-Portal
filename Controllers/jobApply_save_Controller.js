const path=require('path')
const moment=require('moment')
const JobApply = require('../Models/job_applyModel');
const jobModel = require('../Models/jobModel');
const saveModel = require('../Models/saved_jobModel');
const companyModel = require('../Models/companyModel');
const categoryModel = require('../Models/job-categoryModel');
const populate_models=['skillProfile','resumeProfile','empExProfile','educationProfile']
const userModel = require('../Models/userModel');


function days(dateString)
{
    // const  = job.created_at;
    const currentDate = moment();
    const jobCreatedAt = moment(dateString);
    
    // Calculate the difference in days
    const daysAgo = currentDate.diff(jobCreatedAt, 'days');
    
  return daysAgo

           
}


const applyForJob = async (req, res) => {
  try {
    const jobId=req.query.jobid
    // const id=req.params.job_id
     
     const ca_id = req.decodetoken._id;
     
     // Find the employer's document by their identifier
     const job=await jobModel.findById({_id:jobId})
     const id=job._id
     const emp_id = job.user;
    const employer = await userModel.findById({ _id:emp_id});
    const candidate = await userModel.findById({ _id:ca_id}).populate(populate_models);
   
    if (!emp_id) {
      return res.status(404).json({ message: 'Employer not found.' });
    }

  
    const comp=job.company
    const company=await companyModel.findOne({comp_name:comp})
   
    const categ=job.category

    const category=await categoryModel.findOne({category_name:categ})
   
   if(candidate && candidate.resumeProfile)
  {
    const existingApplication = await JobApply.findOne({
      candidate_id:ca_id,
      emp_id:employer._id,
      emp_name:employer.lname,
      company_id:company._id,
      comp_name:comp,
      category_id:category._id,
      category_name:categ,
      job_name:job.job_title, 
      job_id:jobId 
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied for this job with the same index.' });
    }

    const applied = new JobApply({
      candidate_id: ca_id,
      emp_id:emp_id,
      emp_name:employer.lname,
      job_id:jobId,
      job_name:job.job_title,
      company_id:company._id,
      comp_name:comp,
      category_id:category._id,
      category_name:categ,
      apply_at: new Date()
    });

    
    await applied.save();
  
    res.redirect(`/job-detail?id=${id}`);
  } 
  else{
   res.status(400).send('your profile is incomplete')
  }
  } catch (error) {
    console.error('Error applying for a job:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
const save_Job = async (req, res) => {
  try{
    const jobId=req.query.jobid
    // const id=req.params.job_id
     
     const ca_id = req.decodetoken._id;
     
     // Find the employer's document by their identifier
     const job=await jobModel.findById({_id:jobId})
     const id=job._id
     const emp_id = job.user;
    const employer = await userModel.findById({ _id:emp_id});
    const candidate = await userModel.findById({ _id:ca_id}).populate(populate_models);
   
    if (!emp_id) {
      return res.status(404).json({ message: 'Employer not found.' });
    }


  
    const comp=job.company
    const company=await companyModel.findOne({comp_name:comp})
   
    const categ=job.category

    const category=await categoryModel.findOne({category_name:categ})
   
   if(candidate && candidate.resumeProfile)
  {
    const existingApplication = await saveModel.findOne({
      candidate_id:ca_id,
      emp_id:employer._id,
      emp_name:employer.lname,
    
      company_id:company._id,
      comp_name:comp,
      category_id:category._id,
      category_name:categ,
      job_name:job.job_title, 
      job_id:jobId 
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already saved  this job' });
    }

    const saved = new saveModel({
      candidate_id: ca_id,
      emp_id:emp_id,
      emp_name:employer.lname,
   
      job_id:jobId,
      job_name:job.job_title,
      company_id:company._id,
      comp_name:comp,
      category_id:category._id,
      category_name:categ,
    
    });

    await saved.save();
   
   
    res.redirect(`/job-detail?id=${id}`);
  } 
  else{
   res.status(400).send('your profile is incomplete')
  }
  } catch(error) {
    console.error('Error for saving job:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  applyForJob,
  save_Job
};
