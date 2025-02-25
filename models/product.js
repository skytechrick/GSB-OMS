import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    variants: [
        {
            option: {
                type: String,
                required: true,
            },
            availableQuantity: {
                type: Number,
                required: true,
            },
        },
    ],
    specificationTable: [{
        key: {
            type: String,
        },
        value: {
            type: String,
        },
    }],
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    prices: {
        mrp: {
            type: Number,
            required: true,
        },
        sellerPrice: {
            type: Number,
            required: true,
        },
        localPrice: {
            type: Number,
            required: true,
        },
        defaultPrice: {
            type: Number,
            required: true,
        },
    },
    localDelivery: {
        type: Boolean,
        required: true,
    },
    defaultDelivery: {
        type: Boolean,
        default: true,
        required: true,
    },
    gsbCoins: {
        type: Number,
        default: 0,
        max: 50,
    },
    keywords: {
        type: String,
        default: "",
    },
    isCodAvailable: {
        type: Boolean,
        default: false,
    },
    isReturnable: {
        type: Boolean,
        default: false,
    },
    isExchangeable: {
        type: Boolean,
        default: false,
    },
    isFreeDelivery: {
        type: Boolean,
        default: false,
    },
    deliveryCharge: {
        type: Number,
        default: 0,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    mediaHub: {
        images: {
            type: Array,
            default: [],
        },
        videos: {
            type: Array,
            default: [],
        },
    },
    faq: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product_faq",
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product_review",
    }],
    gender: {
        type: String,
        default: "unisex",
    },
    ageGroup: {
        type: String,
        default: "all",
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "seller",
        required: true,
    },
    category: {
        type: String,
        ref: "category",
        required: true,
    },
    subCategory: {
        type: String,
        ref: "sub_category",
        required: true,
    },
    supportOffice: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "support_office",
        required: true,
    },
    addedBy: {
        type: String,
        enum: ["assistant", "seller"],
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

const product = mongoose.model("product", productSchema);

export default product;