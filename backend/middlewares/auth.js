import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import { verifyToken } from '../utils/jwt.js';

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            throw new AppError('Authentication required. Please login first.', 401);
        }

        const decoded = verifyToken(token);
        const user = await userModel.findById(decoded.userId);
        
        if (!user) {
            throw new AppError('User not found', 404);
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            return next(new AppError('Invalid or expired token', 401));
        }
        next(error);
    }
};

