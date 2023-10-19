const mongoose=require('mongoose')
// db connect...
mongoose.connect('mongodb://127.0.0.1:/jobportal').then(()=>{
    console.log("connected to mongodb")
}).catch((err)=>{console.log(err)})
const express=require('express')
const path=require('path')
const app = express();

const job_Route=require('./Routes/mainRoute')
const candidate_Route=require('./Routes/candidateRoutes')

const Auth_Route=require('./Routes/authRoutes')
const employee_Route=require('./Routes/employeeRoutes')

const apply_Route=require('./Routes/jobApply_save_Route')
const fetchUserData = require('./middleware/fetchUserData');
const cookie_parser=require('cookie-parser')

app.use(cookie_parser())
app.use(fetchUserData);

app.use(express.static('public'))

app.use('/',job_Route)
app.use('/',Auth_Route)
// console.log(staticpath)
 app.use('/candidates',candidate_Route)
 app.use('/employers',employee_Route)
 app.use('/candidates',apply_Route)


app.listen(8000,function(){
    console.log(`server running on http://127.0.0.1:${8000}`)
})