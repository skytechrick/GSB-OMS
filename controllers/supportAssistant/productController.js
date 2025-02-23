

export const createProduct = async ( req , res , next ) => {
    try {
        console.log(req.processedImages);
        
        return res.status(201).json({
            status: "success",
            message: "Product created successfully"
        });

    } catch (error) {
        next(error);
    };
};