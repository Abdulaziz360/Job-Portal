// routes/jobApplicationRoute.js

const express = require('express');
const apply_router = express();
const authentication = require('../Middleware/authentication');
const jobApplicationController = require('../Controllers/jobApply_save_Controller');

// Apply for a job
apply_router.post('/apply',authentication.is_login,jobApplicationController.applyForJob);
apply_router.post('/save',authentication.is_login,jobApplicationController.save_Job);

module.exports = apply_router;
