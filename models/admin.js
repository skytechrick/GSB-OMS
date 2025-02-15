import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        max: 255,
    },
    personalDetails:{
        firstName: {
            type: String,
            required: true,
            max: 255,
            min: 3,
        },
        lastName: {
            type: String,
            max: 255,
            min: 3,
            default: null,
        },
        mobileNumber: {
            type: Number,
            default: null
        },
        dob: {
            type: Number,
            min: 13,
            max: 120,
            default: null,
        },
        gender: {
            type: String,
            default: null,
        },
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'main_admin',
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    isBan: {
        type: Boolean,
        default: false,
    },
    banReason: {
        type: String,
        default: null,
        min: 3,
        max: 255,
    },
    loggedIn:{
        token: {
            type: String,
            default: null,
        },
        lastLoggedIn: {
            type: Date,
            default: null,
        },
        loginAttempts: {
            type: Number,
            default: 0,
        },
    },
    authentication: {
        otp: {
            type: Number,
            default: null,
        },
        otpExpiry: {
            type: Date,
            default: null,
        },
        token: {
            type: String,
            default: null,
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Admin = mongoose.model('admin', adminSchema);

export default Admin;