import jwt from "jsonwebtoken";
import { errorHandler }  from "./error.js";

export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token; // get the token from the user's request to login

    if(!token) return next(errorHandler(401, 'Unauthorized')); // if token invalid, return the error thru ,middleware

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => { // now if token exist, verify using jwt
        if(err) return next(errorHandler(403, 'Forbidden')); // if error occured, return the error

        req.user = user; // if the verification passed, allocate the original data to the requested data
        next(); // amd allow the next fumction to be executed in the user.router.js file
    });
};