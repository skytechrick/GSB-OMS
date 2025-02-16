import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
    branchName: {
        type: String,
        required: true,
        max: 255,
        min: 4,
        unique: true,
    },
    managers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch_manager",
    }],
    branchEmail: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
    regionalOffice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "regional_office",
    },
    supportOffices:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "support_office",
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
    branchHistory: [{
        _id: false,
        historyType: {
            type: String,
        },
        relation: {
            type: mongoose.Schema.Types.ObjectId,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    updatedAt: {
        type: Date,
        default: Date.now(),
    },
});

export default mongoose.model('branch', branchSchema);   