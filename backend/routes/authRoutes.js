import express from 'express';
import {signup,login} from '../controllers/authController.js'

const AuthRouter = express.Router();

// POST /api/v1/auth/signup (All User)
AuthRouter.post('/signup', signup);

// POST /api/v1/auth/login (All User)
AuthRouter.post('/login', login);

export default AuthRouter;
