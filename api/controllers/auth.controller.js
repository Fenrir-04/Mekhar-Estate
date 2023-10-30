import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

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
}