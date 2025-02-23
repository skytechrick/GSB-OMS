import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const supportAssistantSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 6,
        lowercase: true,
    },
    profilePicture: {
        type: String,
        default: null,
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
            type: Date,
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
        default: 'main_support_assistant',
    },
    supportOffice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "support_office",
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
    accountHistory: [{
        _id: false,
        historyType: {
            type: String,
        },
        about: {
            type: String,
            default: null,
        },
        relation: {
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
    }],
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

export default mongoose.model('support_assistants', supportAssistantSchema);