import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema({
    personalDetails:{
        name: {
            type: String,
            required: true,
            max: 255,
            min: 3,
        },
        mobileNumber: {
            type: Number,
            default: null
        },
        altMobileNumber: {
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
    email: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
    }],
    shopDetails:{
        shopName: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        shopAddress: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        shopContact: {
            type: Number,
            required: true,
        },
    },
    isOpen: {
        type: Boolean,
        default: false,
    },
    bankAccount:{
        bankName: {
            type: String,
            default: null,
        },
        beneficiaryName: {
            type: String,
            default: null,
        },
        accountNumber: {
            type: Number,
            default: null,
        },
        ifscCode: {
            type: String,
            default: null,
        }
    },
    documents:{
        panId:{
            type: String,
            required: true,
            unique: true,
        },
        aadhaarId:{
            type: String,
            required: true,
            unique: true,
        },
    },
    supportOffice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "support_office",
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
    }],
    orders:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "orders",
    }], 
    address: {
        address_line: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
        pinCode: {
            type: Number,
            required: true,
        },
        district: {
            type: String,
            required: true,
            max: 255,
            min: 3,
        },
        city: {
            type: String,
            required: true,
            max: 255,
            min: 3,
        },
        state: {
            type: String,
            required: true,
            max: 255,
            min: 3,
        },
        country: {
            type: String,
            required: true,
            max: 255,
            min: 4,
        },
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
    isBan: {
        type: Boolean,
        default: false,
    },
    banReason: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: true,
    },
    password: {
        required: true,
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model("sellers", sellerSchema);