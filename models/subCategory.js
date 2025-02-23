import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
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
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
    },
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

export default mongoose.model("sub_category", subCategorySchema);