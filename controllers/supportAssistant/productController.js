import product from "../../models/product.js";
import seller from "../../models/seller.js";
import category from "../../models/category.js";
import subCategory from "../../models/subCategory.js";


import { createProductSchema } from "../../utils/zodSchema.js";

import { localDeliveryPriceCalculation , defaultDeliveryPriceCalculation } from "../../utils/priceCalculation.js";




function checkURL(videoUrl) {
    const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^&\n]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (!videoId) {
        return null;
    }
    return videoUrl;
}

const generateUniqueUrl = (length = 10) => {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let url = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        url += characters[randomIndex];
    }

    return url;
};


export const createProduct = async ( req , res , next ) => {
    try {

        const supportAssistantData = req.supportAssistantData;

        const body = Object.assign({}, req.body);
        // console.log(req.processedImages);
        const validateData = createProductSchema.safeParse(body);
        
        if (!validateData.success) {
            return res.status(400).json({
                status: "error",
                message: validateData.error.errors
            });
        };
        
        body.videos = JSON.parse(body.videos);
        body.variants = JSON.parse(body.variants);
        body.specificationTable = JSON.parse(body.specificationTable);

        
        let newUrl = "";
        while (true) {
            const url = generateUniqueUrl();
            const productExists = await product.exists({ url });
            
            if (!productExists) {
                newUrl = url;
                break;
            };
        };
        
        
        
        
        
        if(body.videos.length > 3) {
            return res.status(400).json({
                status: "error",
                message: "Maximum 3 videos are allowed"
            });
        };
        
        const videos = body.videos.map(e => {
            const s = checkURL(e);
            if(!s) {
                return null;
            };
            return s;
        }).filter(e => e !== null);
        
        
        
        
        
        const categoryExists = await category.findById(body.category).populate("subCategory").exec();
        
        if (!categoryExists) {
            return res.status(400).json({
                status: "error",
                message: "Category does not exist"
            });
        };
        
        const searchedSeller = await seller.findById(body.sellerId).populate("categories").exec();
        
        if(!searchedSeller) {
            return res.status(400).json({
                status: "error",
                message: "Seller does not exist"
            });
        };

        const categoryExistsInSeller = searchedSeller.categories.find(e => e.name === categoryExists.name);

        if(!categoryExistsInSeller) {
            return res.status(400).json({
                status: "error",
                message: "Seller does not have this category"
            });
        };
        
        const subCategoryExists = categoryExists.subCategory.find(e => e._id.toString() === body.subCategory);
        
        if(!subCategoryExists) {
            return res.status(400).json({
                status: "error",
                message: "Sub Category does not exist"
            });
        };


        if(body.variants.length === 0) {
            return res.status(400).json({
                status: "error",
                message: "Atleast one variant is required"
            });
        };

        if(body.title.length < 3 || body.title.length > 255) {
            return res.status(400).json({
                status: "error",
                message: "Title length should be between 3 to 255"
            });
        };

        if(body.description.length < 3 || body.description.length > 5000) {
            return res.status(400).json({
                status: "error",
                message: "Description length should be between 3 to 5000"
            });
        };





        const localPrice =  localDeliveryPriceCalculation(parseInt(body.sellerPrice, 10));
        const defaultPrice =  defaultDeliveryPriceCalculation(parseInt(body.sellerPrice, 10));
        const mrp = parseInt(body.mrp, 10);

        const localDeliveryCharge = mrp - localPrice < 0;
        const deliveryCharge = mrp - defaultPrice < 0;



        const newProductObject = {
            url: newUrl,
            title: body.title,
            description: body.description,
            variants: body.variants,
            prices: {
                mrp,
                sellerPrice: body.sellerPrice,
                localPrice: localDeliveryCharge ? mrp : localPrice,
                defaultPrice: deliveryCharge ? mrp : defaultPrice,
            },
            keywords: body.keywords || "",
            localDelivery: body.localDelivery === "true" ? true : false,
            defaultDelivery: body.defaultDelivery  === "true" ? true : false,
            isCodAvailable: false,  // managers will change this
            isReturnable: false,  // managers will change this
            isExchangeable: false, // managers will change this
            isLocalFreeDelivery: localDeliveryCharge,
            localDeliveryCharge: localDeliveryCharge ? localPrice - mrp : 0,
            isFreeDelivery: deliveryCharge, 
            deliveryCharge: deliveryCharge? defaultPrice - mrp : 0,
            isAvailable: false, // managers will change this
            isVerified: false,  // managers will change this
            gsbCoins: 2, // managers will change this
            media: {
                images: req.processedImages.map(e=> e.image),
                videos: videos,
            },
            gender: body.gender,
            ageGroup: body.ageGroup,
            seller: searchedSeller._id,
            category: categoryExists._id,
            subCategory: subCategoryExists._id,
            supportOffice: supportAssistantData.supportOffice._id,
            addedBy: "assistant",
        };

        const newProduct = new product(newProductObject);

        await newProduct.save();

        return res.status(201).json({
            status: "success",
            message: "Product created successfully"
        });

    } catch (error) {
        next(error);
    };
};