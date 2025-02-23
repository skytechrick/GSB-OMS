import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: 255,
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
    },
    status: {
        type: Boolean,
        default: true,
    },
    subCategory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "sub_category",
    }],
    image: {
        type: String,
        default: null,
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

export default mongoose.model("category", categorySchema);