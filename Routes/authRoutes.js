const express=require('express')
const Auth_controllers=require('../Controllers/Authentication_controller')
const Auth_middleware=require('../Middleware/authentication')
const Auth_Route=express()
Auth_Route.use(express.json())
Auth_Route.use(express.urlencoded({ extended:true }))
const ejs=require('ejs')
const validatorError=require('../Middleware/handleValidationErrors')
const path=require('path')
const viewpath=path.join(__dirname,'../Templates/views/Auth')
Auth_Route.set('view engine','ejs')
Auth_Route.set('views',viewpath)
// multer
const multer=require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        // console.log(file);
        cb(null,path.join(__dirname,'../public/uploads'))
    },
    filename:(req,file,cb)=>{
        const extname=Date.now()+''+file.originalname;
        cb(null,extname)
    }
})
const upload=multer({storage:storage})
// candidate_Route.get('/',candidate_controllers.index_loader)
// candidate_Route.get('/about',candidate_controllers.about_loader)
// candidate_Route.get('/register',candidate_controllers.registration_loader)
Auth_Route.get('/register',Auth_controllers.register_loader)


Auth_Route.post('/register',validatorError,Auth_controllers.userData)

Auth_Route.get('/login',Auth_controllers.login_loader)

Auth_Route.post('/login',Auth_controllers.login_data)

Auth_Route.get('/logout',Auth_controllers.logout)

module.exports=Auth_Route
