const mongoose=require('mongoose')
const company_schema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel'
       },
    
   
    comp_name:{

        type:String,
        required:true
    },
    comp_logo:{
        type:String,
        // required:true
    },
    comp_established:{
        type:Date,
        // required:true
    },
    comp_email:{
        type:String,
        required:true
    },
    created_at:{
        type: Date,
        default: Date.now // Set the default value to the current date and time
    },
    comp_phone:{
        type:String,
        required:true
    },
    comp_team_size:{
        type:Number,
        required:true
    },
    full_address:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    status: {
        type: Number,
        default: 1 // Default value is set to 1
    }
})
module.exports = CompanyModel = mongoose.model("Company",company_schema);