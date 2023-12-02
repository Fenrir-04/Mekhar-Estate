import express from 'express';
import {test, updateUser} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken, updateUser); // first func will verify if the user's data is valid,
                                                   //if yes, then proceed to update the profile else it will fail to go to next function

export default router;