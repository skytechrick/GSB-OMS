import product from "../../models/product.js";

export const getAllProducts = async ( req , res , next ) => {
    try {
         
        const {
            page = 1,
            limit = 10,
        } = req.body;

        const products = await product
            .find({
                supportOffice: req.supportManagerData.supportOffice._id

            })
            .limit(parseInt(limit, 10))
            .skip((parseInt(page, 10) - 1) * limit)
            .exec();

        const totalCount = await product.countDocuments({
            supportOffice: req.supportManagerData.supportOffice._id
        }).exec();

        return res.status(200).json({
            status: "success",
            total: products.length,
            products,
            meta: {
                totalCount,
                limit: parseInt(limit, 10),
                page: parseInt(page, 10),
                availablePages: Math.ceil(totalCount / limit),
                more: (totalCount - ( page * limit )) > 0 ? true : false,
            }
        });


    } catch (error) {
        next(error);
    };
};

export const verifyNewProducts = async ( req , res , next ) => {
    try {

        const {
            id = "",
        } = req.body;

        const productToVerify = await product.findById(id).exec();

        if (!productToVerify) {
            return res.status(404).json({
                status: "error",
                message: "Product not found"
            });
        };

        if (productToVerify.supportOffice.toString() !== req.supportManagerData.supportOffice._id.toString()) {
            return res.status(403).json({
                status: "error",
                message: "You are not allowed to verify this product"
            });
        };

        if(productToVerify.isVerified) {
            return res.status(400).json({
                status: "error",
                message: "Product already verified",
            });
        };

        productToVerify.isVerified = true;
        productToVerify.isCodAvailable = req.body.isCodAvailable ? req.body.isCodAvailable: false;
        productToVerify.isReturnable = req.body.isReturnable ? req.body.isReturnable: false;
        productToVerify.isExchangeable = req.body.isExchangeable ? req.body.isExchangeable: false;
        productToVerify.isAvailable = req.body.isAvailable ? req.body.isAvailable: false;
        productToVerify.isVerified = true;

        await productToVerify.save();

        return res.status(200).json({
            status: "success",
            message: "Product verified successfully"
        });

    } catch (error) {
        next(error);
    };
};


export const getProductByFilter = async ( req , res , next ) => {
    try {

        const {
            page = 1,
            limit = 10,
        } = req.query;

        const filterQuery = {
            supportOffice: req.supportManagerData.supportOffice._id.toString(),
            isVerified: req.query.isVerified === "1" ? true : req.query.isVerified === "0"? false : undefined,
            isAvailable: req.query.isAvailable === "1" ? true : req.query.isAvailable === "0"? false : undefined,
            isCodAvailable: req.query.isCodAvailable === "1" ? true : req.query.isCodAvailable === "0"? false : undefined,
            isReturnable: req.query.isReturnable === "1" ? true : req.query.isReturnable === "0"? false : undefined,
            isExchangeable: req.query.isExchangeable === "1" ? true : req.query.isExchangeable === "0"? false : undefined,
            isLocalFreeDelivery: req.query.isLocalFreeDelivery === "1" ? true : req.query.isLocalFreeDelivery === "0"? false : undefined,
            isFreeDelivery: req.query.isFreeDelivery === "1" ? true : req.query.isFreeDelivery === "0"? false : undefined,
        };

        Object.keys(filterQuery).forEach(key => {
            if (filterQuery[key] === undefined) {
                delete filterQuery[key];
            }
        });

        const products = await product
            .find(filterQuery)
            .limit(parseInt(limit, 10))
            .skip((parseInt(page, 10) - 1) * limit)
            .exec();

        const totalCount = await product.countDocuments(filterQuery).exec();

        return res.status(200).json({
            status: "success",
            total: products.length,
            products,
            meta: {
                totalCount,
                limit: parseInt(limit, 10),
                page: parseInt(page, 10),
                availablePages: Math.ceil(totalCount / limit),
                more: (totalCount - ( parseInt(page, 10) * parseInt(limit, 10) )) > 0 ? true : false,
            }
        });

    } catch (error) {
        next(error);
    };
};