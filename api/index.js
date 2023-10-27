import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

mongoose.connect(process.env.MongoUrl)
.then(() => {
    console.log("Database connected successfully!");
})
.catch((err) => {
    console.log(err.message);
})

app.listen(3000, () => {
    console.log('Port is running on port 3000!');
})


