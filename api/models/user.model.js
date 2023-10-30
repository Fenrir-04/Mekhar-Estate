import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({ // Define the schema of the database model
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }

}, {timestamps: true}); // to get the timestamps when we need to sort or operate on the data present in database based on dates or time

const User = mongoose.model('User',userSchema); // ceating a model with the schema that we created above

export default User;