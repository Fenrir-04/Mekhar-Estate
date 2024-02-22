import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.router.js';
import authRouter from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import listingRouter from './routes/listing.route.js';

dotenv.config();

const app = express(); // start server

app.use(cookieParser());



mongoose.connect(process.env.MongoUrl) // connect server to mongoDB
.then(() => {
    console.log("Database connected successfully!");
})
.catch((err) => {
    console.log(err.message);
})

app.listen(3000, () => { 
    console.log('Server is running on port 3000!'); //make sever listen on the port 3000
});

app.use(express.json());


app.use('/api/user', userRouter); // user functions api route
app.use('/api/auth', authRouter); // signup api route
app.use('/api/listing', listingRouter); // api to create listing of houses in website


// middleware to handle errors in baackend
app.use((err,req,res,next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server issue!';
    return res.status(statusCode)
    .json(
        {
            success: false,
            statusCode,
            message,
        }
    );
});


