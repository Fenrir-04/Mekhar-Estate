import express from 'express';
import {deleteUser, test, updateUser, } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser); // first func will verify if the user's data is valid,
//if yes, then proceed to update the profile else it will fail to go to next function
router.delete('/delete/:id', verifyToken, deleteUser);



export default router;