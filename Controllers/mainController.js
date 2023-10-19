const moment=require('moment')
const userModel = require('../Models/userModel')
const CandidateModel = require('../Models/candidate_model')

const companyModel = require('../Models/companyModel')
const categoryModel = require('../Models/job-categoryModel')
const jobModel = require('../Models/jobModel')
const jwt = require('jsonwebtoken')
const job_applyModel = require('../Models/job_applyModel')
const saved_jobModel = require('../Models/saved_jobModel')
const populate_models = ['companyProfile', 'categoryProfile', 'jobProfile']


function days(dateString)
{
    // const  = job.created_at;
    const currentDate = moment();
    console.log('curren m:',currentDate)
    const jobCreatedAt = moment(dateString);
    
    // Calculate the difference in days
    const daysAgo = currentDate.diff(jobCreatedAt, 'days');
    
  return daysAgo

           
}


// Inside the index_loader function
const index_loader = async (req, res) => {
    try {
        const user = res.locals.user;
        const category = await categoryModel.find();
        const company = await companyModel.find();
        const job = await jobModel.find();


        const counts = {};

        for (const jobItem of job) {
            const companyName = jobItem.company;
            const categoryName = jobItem.category;
            counts[companyName] = (counts[companyName] || 0) + 1;
            counts[categoryName] = (counts[categoryName] || 0) + 1;
        }


        res.render('index', {
            user,
            category,
            company,
            job,

            counts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const candidates_list_loader = async (req, res) => {
    try {
        const user = res.locals.user;
        var page = 1
        if (req.query.page) {
            page = req.query.page
        }
        const limit = 6;
        const candidates = await userModel.find({ role_as: '2' }).populate('resumeProfile').populate('skillProfile').populate('empExProfile').populate('educationProfile')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await userModel.find({ role_as: '2' }).populate('resumeProfile').populate('skillProfile').populate('empExProfile').populate('educationProfile').countDocuments();
        const totalpages = Math.ceil(count / limit);
        // console.log(totalpages)
        const pages = [];
        for (let i = 1; i <= totalpages; i++) {
            pages.push(i);
        }
        var Nextpage = parseInt(page) + 1
        if (Nextpage > totalpages) {
            Nextpage = null;
        }
        res.render('candidates_list', {
            candidate: candidates,
            totalpages: Math.ceil(count / limit),
            currentpage: page,
            pages: pages,
            next: Nextpage,
            prev: page - 1,
            user,
        });
        // No token available, render the index file without user data


        // console.log(`total:${count}`)
    } catch (error) {
        console.log(error);
    }
};


// profile

const candidate_profile_loader = async (req, res) => {

    try {
        const index = req.params._id;
        const user = res.locals.user;
        // Fetch the candidate based on the index
        const candidate = await userModel.findById({ _id: index }).populate('resumeProfile').populate('skillProfile').populate('empExProfile').populate('educationProfile')

        if (!candidate) {
            return res.status(404).send('Candidate not found');
        }


        res.render('candidate_profile', { candidate, user });
        // No token available, render the index file without user data


    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
};
// employers-----------
const employers_list_loader = async (req, res) => {
    try {
        const user = res.locals.user;
        const employer = await userModel.find({ role_as: '1' })

        // console.log(`Employer:${employer}`)
        res.render('employers_list', { employer, user })
    } catch (error) {
        console.log(error)
    }
}
const employer_profile_loader = async (req, res) => {
    try {

        const iteration = req.params.index
        const user = res.locals.user;


        const employers = await userModel.find({ role_as: '1' });
      


        if (iteration >= 1 && iteration <= employers.length) {
            let Empty=null
            let job=''
            const employer = employers[iteration - 1];
            const user_id=employer._id
             job = await jobModel.find({user:user_id });
            //  console.log('job:',job)
            if(job && job[0]){
                const title=job[0].job_title
            res.render('employer_profile', { employer, user,job,title});
            }
            else
            {
                
                res.render('employer_profile', { employer, user,job:''});
            }
        } else {

            res.status(404).send('Employer not found');
        }
    } catch (error) {
        console.log(error);
        // Handle any errors that occur during the process
        res.status(500).send('Internal Server Error');
    }
}
// job controllers..........................................

// const jobs_list_loader = async (req, res) => {
//     try {
//       const user = res.locals.user;
//       const page = req.query.page || 1;
//       const perPage = 10; // Number of jobs per page
//       const searchQuery = req.query.search; // Get search query from request
//   console.log('searchQuery:',searchQuery)
//       // Define the search query for job titles
//       const jobTitleQuery = { job_title: { $regex: new RegExp(searchQuery, 'i') } };
  
//       // Fetch paginated job listings based on search and pagination parameters
//       const jobs = await jobModel
//         .find(jobTitleQuery)
//         .skip((page - 1) * perPage)
//         .limit(perPage)
//         .exec();
  
//       const companies = await companyModel.find();
//       const categories = await categoryModel.find();
  
//       res.render('jobs_list', {
//          user,
//           jobs,
//            companies, 
//            categories,
//             searchQuery,
//             currentPage:page
//         });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error in job loader');
//     }
//   };
  

const job_detail_loader = async (req, res) => {
    try {
        const userId = req.decodedToken._id
       
        
       var  applied_msg=''
       var  saved_msg=''
            const _id=req.query.id
            const job = await jobModel.findById({ _id:_id})
             
             const applied_job=await job_applyModel.findOne({candidate_id:userId,job_id:job._id})
             const saved_job=await saved_jobModel.findOne({candidate_id:userId,job_id:job._id})
           
           if(applied_job)
           {
            if(applied_job.job_id.equals(job._id)){
            // console.log('apid:',applied_job.job_id,job._id)
             applied_msg='Applied'
            }
           }
           if(saved_job)
           { 
            if(saved_job.job_id.equals(job._id))
            {
            // console.log('said:',saved_job.job_id)
             saved_msg='saved'
            }
           }
         

        const compName = job.company

        const categoryName = job.category

        const category = await categoryModel.findOne({ category_name: categoryName })
        const company = await companyModel.findOne({ comp_name: compName })

        if (job) {
    

            const daysAgo= days(job.created_at)
    
            // console.log('days:',daysAgo)

// close date..........
            const close_date = job.job_close_date
            let date = new Date(close_date)
            let options = { day: '2-digit', month: 'short', year: 'numeric' }
            let format = date.toLocaleDateString('en', options).split(' ')
            let jobC_date = `${format[1]} ${format[0]} ${format[2]}`

            const post_date = job.created_at
            let P_Date = new Date(post_date)
            let option = { day: '2-digit', month: 'short', year: 'numeric' }
            let Format = P_Date.toLocaleDateString('en', option).split(' ')
            let jobPost_date = `${Format[1]} ${Format[0]} ${Format[2]}`
            const user = res.locals.user;
            const user_id = req.decodedToken._id
            const user_data = await userModel.findById({ _id: user_id })
          
            if (user_data.role_as == 2) {
                res.render('job_detail', {
                    user,
                    user_data,
                    job,
                    jobC_date,
                    jobPost_date,
                    company,
                    category,
                    daysAgo,
                    applied_msg,
                    saved_msg,
                })

            }
           
          
            else {
                res.render('job_detail', {
                    user,
                    job,
                    jobC_date,
                    jobPost_date,
                    user_data: "",
                    company,
                    category,
                    daysAgo,
                    applied_msg:"",
                    saved_msg:""
                })
            }

        }
        else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.log(`Error in job detail controller: ${error}`);
    }
};
// job categories--->
const job_category_loader = async (req, res) => {
    try {
        const user = res.locals.user
        const _id = req.params.id
        const jobs = await jobModel.find({ category_id: _id })
        let category_jobs=[]
         for(let i=0;i<jobs.length;i++)
         {    
            // const daysAgo=
             const companies = await companyModel.findById({_id:jobs[i].company_id})
             let categoryjob_data={}
             if(companies)
             {
                   categoryjob_data={
                   _id:jobs[i]._id,
                   job_title:jobs[i].job_title,
                   full_address:jobs[i].full_address,
                   req_experience:jobs[i].req_experience,
                   min_salary:jobs[i].min_salary,
                   max_salary:jobs[i].max_salary,
                   job_type:jobs[i].job_type,
                   daysAgo:days(jobs[i].created_at),
                   comp_logo:companies.comp_logo

                   }
                   category_jobs.push(categoryjob_data)
             }

         }

        res.render('job_categories', {
            user,
            category_jobs,
           
        })

    } catch (error) {
        console.log(`error in job category loader:${error}`)
    }
}
//  
const job_company_loader = async (req, res) => {
    try {
        const user = res.locals.user
        const _id = req.params.id
        const jobs = await jobModel.find({ company_id: _id })
        let company_jobs=[]
         for(let i=0;i<jobs.length;i++)
         {    
            // const daysAgo=
             const companies = await companyModel.findById({_id:jobs[i].company_id})
             let companyjob_data={}
             if(companies)
             {
                   companyjob_data={
                   _id:jobs[i]._id,
                   job_title:jobs[i].job_title,
                   full_address:jobs[i].full_address,
                   req_experience:jobs[i].req_experience,
                   min_salary:jobs[i].min_salary,
                   max_salary:jobs[i].max_salary,
                   job_type:jobs[i].job_type,
                   daysAgo:days(jobs[i].created_at),
                   comp_logo:companies.comp_logo

                   }
                   company_jobs.push(companyjob_data)
             }

         }
        res.render('job_companies', {
            user,
            company_jobs
        })

    } catch (error) {
        console.log(`error in job company loader:${error}`)
    }
}
// pages--->
const about_us_loader=async(req,res)=>
{
    try {
        res.render('about_us')
    } catch (error) {
        console.log('error in about us controller:',error)
    }
}
const contact_us_loader=async(req,res)=>
{
    try {
        res.render('contact_us')
    } catch (error) {
        console.log('error in about us controller:',error)
    }
}
const faq_loader=async(req,res)=>
{
    try {
        res.render('faq')
    } catch (error) {
        console.log('error in about us controller:',error)
    }
}







// jobs_list
const listJobs = async (req, res) => {
    try {
        const jobs = await jobModel.find();
        const categories = await categoryModel.find();
        const companies = await companyModel.find();
        var filteredJobs=''
        res.render('jobs_list',{ success: true, jobs,categories,companies,filteredJobs });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error listing jobs', error: err });
    }
};

// Filter jobs based on criteria
const filterJobs = async (req, res) => {
    try {
        const { category_id, company_id, job_title, job_type } = req.query;
        const filter = {};
        
        if (category_id) {
            filter.category_id = category_id;
        }
        if (company_id) {
            filter.company_id = company_id;
        }
        if (job_title) {
            filter.job_title = { $regex: `^${job_title.slice(0, 3)}`, $options: 'i' };
            // Match first three letters

            // Case-insensitive search
        }
        if (job_type) {
            filter.job_type = job_type;
        }

        // Use .populate() to populate the 'companyModel' field
        var page =1
        if (req.query.page) {
            page = req.query.page
        }
        // console.log('pages:',req.query.page)
        const limit=1
        const filteredJobs = await jobModel.find(filter).populate('company_id').limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
        
        const count=await jobModel.find(filter).populate('company_id').countDocuments()
        const totalpages = Math.ceil(count / limit);
        // console.log(totalpages)
        const pages = [];
        for (let i = 1; i <= totalpages; i++) {
            pages.push(i);
        }
        var Nextpage = parseInt(page) + 1
        if (Nextpage >=  totalpages) {
            Nextpage = 1;
        }
        let pagination={

            totalpages: Math.ceil(count / limit),
            currentpage: page,
            pages: pages,
            next: Nextpage,
            prev: page - 1, 
        }
        res.json({
             success: true, 
             jobs: filteredJobs,
             pagination
            
             });
    } catch (err) {
        res.status(500).json({
             success: false,
              message: 'Error filtering jobs', error: err });
    }
};


// Load more jobs
// Load more jobs
const loadMoreJobs = async (req, res) => {
    const { next_limit } = req.query;
    const limit = next_limit || 2; // Set the limit to 2 by default or use the provided limit
    const page = req.query.page || 1; // Get the page number from the request

    try {
        // Calculate the number of jobs to skip based on the page number and limit
        const skip = (page - 1) * limit;

        // Query the database with the specified limit and skip
        const jobs = await jobModel
            .find()
            .skip(skip)
            .limit(limit);

        const total_jobs = await jobModel.countDocuments(); // Get the total number of jobs

        res.json({ success: true, jobs, total_jobs, offset: page }); // Return the current page number as "offset"
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error loading jobs', error: err });
    }
};


module.exports = {
    index_loader,

    candidates_list_loader,
    candidate_profile_loader,

    employers_list_loader,
    employer_profile_loader,
    
    // jobs_list_loader,
    job_detail_loader,

    job_category_loader,
    job_company_loader ,
    // pages-->>>
    about_us_loader,
    contact_us_loader,
    faq_loader,
listJobs,
filterJobs,
loadMoreJobs

    // jobs_list

}