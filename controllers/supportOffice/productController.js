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

        // const {
        //     id,
            
        // } = req.body;

        // will done tomorrow

    } catch (error) {
        next(error);
    };
};