import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.router.js';
import authRouter from './routes/auth.route.js';

dotenv.config();

const app = express(); // start server

mongoose.connect(process.env.MongoUrl) // connect server to mongoDB
.then(() => {
    console.log("Database connected successfully!");
})
.catch((err) => {
    console.log(err.message);
})

app.listen(3000, () => { 
    console.log('Port is running on port 3000!'); //make sever listen on the port 3000
});

app.use(express.json());

app.use('/api/user', userRouter); // test api route
app.use('/api/auth', authRouter); // signup api route


