import mongoose from "mongoose";

const supporOfficeSchema = new mongoose.Schema({
    supportOfficeName: {
        type: String,
        required: true,
        max: 255,
        min: 4,
        unique: true,
    },
    managers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "support_manager",
    }],
    supportOfficeEmail: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch",
    },
    sellers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "sellers",
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
    supportOfficeHistory: [{
        _id: false,
        historyType: {
            type: String,
        },
        about: {
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

export default mongoose.model("support_office" , supporOfficeSchema);