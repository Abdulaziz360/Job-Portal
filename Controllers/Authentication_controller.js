const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');
const path = require('path');
const { use } = require('../Routes/authRoutes');

const register_loader = async (req, res) => {
    try {
        const message=''
        const error=''
        res.render('registration',{message,error});
    } catch (error) {
        console.log(error);
    }
};
// login loader
const login_loader = async (req, res) => {
    try {
        const message=''
        res.render('login',{message});
    } catch (error) {
        console.log(error);
    }
};

const secure_password = async (password) => {
    try {
        const secu_pass = await bcrypt.hash(password, 10);
        return secu_pass;
    } catch (error) {
        console.log(error);
    }
};

const token_generation = async (_id,role_as) => {
    try {
        const jwt_token = await jwt.sign({ _id: _id,role_as:role_as }, 'mysecretkeyfortoken', { expiresIn: '1d' });
        return jwt_token;
    } catch (error) {
        console.log(`error in token gen${error}`);
    }
};

const userData = async (req, res) => {
    try {
        // message=''
        // let successmessage=''
        const hash = await secure_password(req.body.password);
       
        if (req.body.password !== req.body.cpassword) {
            const error=''
            const message= "The password field confirmation does not match.";
            return res.render('registration', {message,error});
        }
        const user = new userModel({
            fname: req.body.fname,
            lname: req.body.lname,
            phone: req.body.phone,
            email: req.body.email,
            password: hash,
            cpassword: hash, // Use cpassword field for confirm password
            gender: req.body.gender,
            role_as:req.body.role_as // Add gender field
            // dob: new Date(req.body.dob), // Add Date of Birth field
        });

     

        const data_save = await user.save();

        if (!data_save) {
            return res.status(401).json("User not saved");
        } else {
             const error=''
            const message='You are successfully registered'
            res.render('registration', {message,error});
        }
    } catch (error) {
            console.log(`Error in post: ${error}`);
    }
};
// login user data
const login_data=async(req,res)=>{
try 
{
           const email=req.body.email
           const password=req.body.password
          const user=await userModel.findOne({email:email})
        // console.log(`user data:${user.password}`)
        if(user)
        { 

            if(user.role_as=='2')
            {  
                    const is_Match=await bcrypt.compare(password,user.password)
                    if(is_Match)
                    {  console.log('userid:',user._id)
                       const jwt_token=await token_generation(user._id,user.role_as)

                       user.tokens=[{token:jwt_token}]  
                       await user.save() 
                       res.cookie('myjwt',jwt_token,
                       {
                         httpOnly:true
                       })
                       const message='success'
                       return res.redirect('/candidates/candidate-dashboard') 
                    }
                   else
                   {
                      const message='invalid login detail'
                      return res.render('login',{message}) 
                   }
            }
            if(user.role_as=='1')
            {
                const is_Match=await bcrypt.compare(password,user.password)
                if(is_Match)
                {   console.log('userid:',user._id)
                    const jwt_token=await token_generation(user._id,user.role_as)
                   
                    user.tokens=[{token:jwt_token}]  
                    await user.save() 
                    res.cookie('myjwt',jwt_token,
                    {
                       httpOnly:true
                    })
                    const message='success'
                    return res.redirect('/employers/employer-dashboard') 
                }
                else
                {
                     const message='invalid login detail'
                     return res.render('login',{message}) 
                } 
            }  
            else
            {
                const message='unmatched'
                return res.render('login',{message}) 
            }
        }
        else{
            const message='invalid login detail'
            return res.render('login',{message}) 
        }
    } 
    catch(error) 
    {
        const message='invalid login data'
        return res.render('login',{message}) 
    }
}

// logout--->
const logout = async (req, res) => {
    try {
      // Clear the 'myjwt' cookie by setting an expired date in the past
      res.clearCookie('myjwt');
  
      // Get the user's ID from the decoded token
      const decodedToken = req.decodedToken; // Assuming you have decoded the token earlier
      const userId = decodedToken._id;
  
      // Update the user's document in the database to clear the 'token' field
      await userModel.findOneAndUpdate(
        { _id: userId },
        { $set: { tokens: null } },{new:true} // Set 'token' to null or an empty string to clear it
      );
  
      // Redirect or respond with a success message
      res.redirect('/'); // Redirect to the login page after logout
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).send('Internal server error');
    }
  };
 

  

module.exports = {
    register_loader,
    userData,
    login_loader,
    login_data,
    logout,
};
