import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const signup = async (req,res,next) => {
    const {username, email, password} = req.body; // get the contents of the user 
    const hashPassword = bcryptjs.hashSync(password, 10); // for encryption of the password
    const newUser = new User({username, email, password: hashPassword}); // put the contents of user in the database
    
    try{
        await newUser.save(); // method to save the user data in database
        res.status(201)
        .json(
            {
                message: "User data added successfully!"
            }
        );
    }
    catch(err){
        next(err);
    }
};

export const signin = async (req,res,next) => {
    const {email, password} = req.body; // get the email n pass that the user enters in sign in page
    try{
        const validUser = await User.findOne({email}); // find the email that user entered in the database(User)
        if(!validUser) return next(errorHandler(404, 'User not found :c')); // if no such email is found
        const validPassword = bcryptjs.compareSync(password, validUser.password); // now compare the entered password with the password stored with the original email in the database
        if(!validPassword) return next(errorHandler(401, 'Either email or password is incorrect!')); // if paasword doesn't match

        const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET); // create a unique jwt token based on the unique id of the user
        const {password: pass, ...rest} = validUser._doc; // removing the password from validUser being shown
        res.cookie('access_token', token, {httpOnly: true }) // send the created token as the cookie in the browser thru the response
        .status(200)
        .json(rest); // send the final data that is stored in rest(other than password all data)
    }
    catch(error){
        next(error);
    }
}

export const google = async (req, res, next) => {
  try { 
    const user = await User.findOne({ email: req.body.email }); // get the user details from the user's entered google account
    if (user) { // if user already exits, simply update the data in database
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); // create a token
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else { // if it is a new user, crwate a new userdata and enter in database
      const generatedPassword =
        Math.random().toString(36).slice(-8) + // it is done to make kalam mekhar -> kalammekhar029@ to make oit more unique
        Math.random().toString(36).slice(-8); 
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10); // hash the password with 10 salt
      const newUser = new User({ // create a new user according to the schema
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save(); // save the newly entered user data
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET); // generate the token
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req,res,next) => {
  try{
    res.clearCookie('access_token');
    res.status(200).json('User logged out successfully!');
  }
  catch(err){
    next(err);
  }
};