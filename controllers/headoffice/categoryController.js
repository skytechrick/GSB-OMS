import category from "../../models/category.js";

export const createCategory = async ( req , res , next ) => {
    try {

        const adminData = req.adminData;

        const { name , description } = req.body;

        if ( !name || !description ) {
            return res.status(400).json({
                status: "failed",
                message: "All fields are required"
            });
        };

        if(!(name.length >= 3 && name.length <= 255)){
            return res.status(400).json({
                status: "failed",
                message: "Name must be between 3 to 255 characters"
            });
        };

        if(!(description.length >= 3 && description.length <= 500)){
            return res.status(400).json({
                status: "failed",
                message: "Description must be between 3 to 500 characters"
            });
        };

        if(!req.files){
            return res.status(400).json({
                status: "failed",
                message: "Image is required"
            });
        };

        if(!req.files.image){
            return res.status(400).json({
                status: "failed",
                message: "Image not found",
            });
        };

        const uploadedFile = req.files.image[0]?.filename;

        if(!uploadedFile){
            return res.status(400).json({
                status: "failed",
                message: "Image not uploaded",
            });
        };

        const search = await category.exists({ name: name });

        if(search){
            return res.status(400).json({
                status: "failed",
                message: "Category already exists"
            });
        };
        
        const newCategory = new category({
            name: name,
            description: description,
            image: uploadedFile,
        });

        const saveCategory = await newCategory.save();

        return res.status(200).json({
            status: "success",
            message: "Category created successfully",
            data: saveCategory,
        });
        
    } catch (error) {
        next(error);
    };
};