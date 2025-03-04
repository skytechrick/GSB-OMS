import mongoose from "mongoose";
const Schema = mongoose.Schema;

const regionalOfficeSchema = new Schema({
    regionalOfficeName: {
        type: String,
        required: true,
        max: 255,
        min: 4,
        unique: true,
    },
    officialEmail: {
        type: String,
        required: true,
        unique: true,
        max: 255,
        min: 4,
        lowercase: true,
    },
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
    regionalOfficeHistory: [{
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
    regionalOfficers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "regional_officer",
    }],
    branches:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "branch",
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

const regionalOffice = mongoose.model("regional_office", regionalOfficeSchema);

export default regionalOffice;