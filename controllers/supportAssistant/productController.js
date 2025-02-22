

export const createProduct = async ( req , res , next ) => {
    try {
        
        return res.status(201).json({
            status: "success",
            message: "Product created successfully"
        });

    } catch (error) {
        next(error);
    };
};