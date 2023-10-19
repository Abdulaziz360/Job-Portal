const mongoose=require('mongoose')

const category_Schema=new mongoose.Schema({

   user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'UserModel'
   },
  
    category_name:{
        type:String,
        required:true
    },
    category_image:{
        type:String,
        required:true
    },
    created_at:{
        type:Date,
        default:Date.now
    }
})
module.exports=new mongoose.model('Job-category',category_Schema)