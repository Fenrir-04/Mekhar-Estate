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