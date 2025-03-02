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