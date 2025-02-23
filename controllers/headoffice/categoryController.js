import category from "../../models/category.js";
import subCategory from "../../models/subCategory.js";

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

export const getAllCategories = async ( req , res , next ) => {
    try {

        const adminData = req.adminData;

        const {
            page = 1,
            limit = 10,
        } = req.query;

        const categories = await category.find()
        .populate("subCategory")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await category.countDocuments();

        return res.status(200).json({
            status: "success",
            message: "Categories fetched successfully",
            totalCount: categories.length,
            data: categories,
            meta: {
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page, 10),
                currentLimit: parseInt(limit, 10),
                total: count,
                more: count - (page * limit) > 0 ? true : false,
            }
        });

    } catch (error) {
        next(error);
    };
};


export const createSubCategory = async ( req , res , next ) => {
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

        const search = await subCategory.exists({ name: name });

        if(search){
            return res.status(400).json({
                status: "failed",
                message: "Sub-Category already exists"
            });
        };

        const categoryData = await category.findOne({
            _id: req.body.categoryId,
        });

        if(!categoryData){
            return res.status(400).json({
                status: "failed",
                message: "Category not found"
            });
        };
        
        const newSubCategory = new subCategory({
            name: name,
            description: description,
            category: categoryData._id,
        });
        const saveSubCategory = await newSubCategory.save();

        categoryData.subCategory.push(saveSubCategory._id);
        await categoryData.save();
        
        return res.status(200).json({
            status: "success",
            message: "Category created successfully",
            data: saveSubCategory,
        });
        
    } catch (error) {
        next(error);
    };
};

export const getAllSubCategories = async ( req , res , next ) => {
    try {

        const adminData = req.adminData;

        const {
            page = 1,
            limit = 10,
        } = req.query;

        const subCategories = await subCategory.find()
        .populate("category")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

        const count = await subCategory.countDocuments();

        return res.status(200).json({
            status: "success",
            message: "Sub-Categories fetched successfully",
            totalCount: subCategories.length,
            data: subCategories,
            meta: {
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page, 10),
                currentLimit: parseInt(limit, 10),
                total: count,
                more: count - (page * limit) > 0 ? true : false,
            }
        });

    } catch (error) {
        next(error);
    };
};