import bcrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import { sendWelcomeToN8n } from '../utils/sendWelcomeToN8n.js';
import { sendOtpToN8n } from '../utils/sendOtpToN8n.js';
import { generateToken } from '../utils/jwt.js';
import { getCookieOptions, getClearCookieOptions } from '../utils/cookieConfig.js';

export const registerUser = async (req, res, next) => {
    const { name, email, username, password } = req.body;

    try {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim();

        const existingUserByEmail = await userModel.findOne({ email: normalizedEmail });
        if(existingUserByEmail) throw new AppError('User with this email already exists', 400);

        const existingUserByUsername = await userModel.findOne({ username: normalizedUsername });
        if(existingUserByUsername) throw new AppError('Username already exists', 400);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await userModel.create({ name, email: normalizedEmail, username: normalizedUsername, password: hashedPassword });

        const token = generateToken(newUser._id, newUser.email);
        res.cookie('token', token, getCookieOptions());
        
        // Send welcome email (non-blocking - registration succeeds even if email fails)
        try {
            const emailResult = await sendWelcomeToN8n(email, name);
            if (!emailResult.success) {
                console.warn('User registered but welcome email failed:', emailResult.error);
            }
        } catch (error) {
            // Log but don't fail registration if email service fails
            console.error('Welcome email error (non-critical):', error.message);
        }

        return res.status(201).json({ 
            success: true, 
            message: 'Registration successful', 
            user: { 
                id: newUser._id, 
                name: newUser.name, 
                email: newUser.email, 
                username: newUser.username,
                isAccountVerified: newUser.isAccountVerified
            } 
        });

    }catch (error) {
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    const { identifier, email, username, password } = req.body;

    try{
     
        let loginIdentifier = identifier;
        if (!loginIdentifier) {
            loginIdentifier = email || username;
        }

        if (!loginIdentifier) {
           throw new AppError('Email, username, or identifier is required', 400);
        }

        const isEmail = loginIdentifier.includes('@');
        
        let user;
        if (isEmail) {
            const normalizedEmail = loginIdentifier.trim().toLowerCase();
            user = await userModel.findOne({ email: normalizedEmail });
        } else {
            const normalizedUsername = loginIdentifier.trim();
            user = await userModel.findOne({ username: normalizedUsername });
        }

        if(!user) { 
            throw new AppError('Invalid credentials', 400);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) { 
            throw new AppError('Invalid credentials', 400);
        }

        const token = generateToken(user._id, user.email);
        res.cookie('token', token, getCookieOptions());

        return res.status(200).json({ success: true, message: 'Login successful', 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                username: user.username,
                isAccountVerified: user.isAccountVerified
            } 
        });

    }catch (error) {
       next(error);
    }

}

export const logoutUser = async (req, res, next) => {
    try{
        res.clearCookie('token', getClearCookieOptions());

        return res.status(200).json({ 
            success: true, 
            message: 'Logout successful' 
        });

    }catch (error) {
        next(error);
    }
}

export const checkUserName = async (req, res, next) => {
    const { username } = req.body;
  
    try{
        const existingUser = await userModel.findOne({ username });
        if(existingUser) { 
            throw new AppError('Username already exists', 400);
        }
        return res.status(200).json({ success: true, message: 'Username is available' });
    }catch (error) {
        next(error);
    }
}

export const requestVerification = async (req, res, next) => {
    try {
        const user = req.user;

        if (user.isAccountVerified) {
            return res.status(200).json({ 
                success: true, 
                message: 'Account is already verified' 
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        user.verifyOtpHash = hashedOtp;
        user.verifyOtpExpiry = otpExpiry;
        await user.save();

        try {
            const emailResult = await sendOtpToN8n(user.email, otp);
            if (!emailResult.success) {
                console.warn('OTP generation succeeded but email sending failed:', emailResult.error);
            }
        } catch (error) {
            console.error('OTP email error (non-critical):', error.message);
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Verification OTP sent to your email' 
        });

    } catch (error) {
        next(error);
    }
}

export const verifyOtp = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const user = req.user;

        if (user.isAccountVerified) {
            return res.status(200).json({ 
                success: true, 
                message: 'Account is already verified' 
            });
        }

        if (!user.verifyOtpHash || !user.verifyOtpExpiry) {
            throw new AppError('No verification OTP found. Please request a new OTP.', 400);
        }

        if (new Date() > user.verifyOtpExpiry) {
            user.verifyOtpHash = null;
            user.verifyOtpExpiry = null;
            await user.save();
            throw new AppError('OTP has expired. Please request a new OTP.', 400);
        }

        const isOtpValid = await bcrypt.compare(otp, user.verifyOtpHash);
        if (!isOtpValid) {
            throw new AppError('Invalid OTP', 400);
        }

        user.isAccountVerified = true;
        user.verifyOtpHash = null;
        user.verifyOtpExpiry = null;
        await user.save();

        return res.status(200).json({ 
            success: true, 
            message: 'Account verified successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                isAccountVerified: user.isAccountVerified
            }
        });

    } catch (error) {
        next(error);
    }
}

export const getCurrentUser = async (req, res, next) => {
    try {
        const user = req.user;

        return res.status(200).json({ 
            success: true, 
            user: { 
                id: user._id, 
                name: user.name, 
                email: user.email, 
                username: user.username,
                isAccountVerified: user.isAccountVerified
            } 
        });

    } catch (error) {
        next(error);
    }
}
