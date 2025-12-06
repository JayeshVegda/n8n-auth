import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    username: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    // ------------------------------
    // Account Verification OTP
    // ------------------------------
    verifyOtpHash: {
        type: String,
        default: null
    },

    verifyOtpExpiry: {
        type: Date,
        default: null,
        index: { expires: 0 }   // TTL auto delete when expired
    },

    isAccountVerified: {
        type: Boolean,
        default: false
    },

    // ------------------------------
    // Reset Password OTP
    // ------------------------------
    resetPasswordOtpHash: {
        type: String,
        default: null
    },

    resetPasswordOtpExpiry: {
        type: Date,
        default: null,
        index: { expires: 0 }   // TTL auto delete
    },

}, { timestamps: true });  // auto add createdAt + updatedAt

const userModel = mongoose.model("User", userSchema);

export default userModel;
