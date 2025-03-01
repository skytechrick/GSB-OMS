import seller from '../../models/seller.js';
import supportOffice from '../../models/supportOffice.js';

import { createSellerSchema } from '../../utils/zodSchema.js';
import { hashPassword } from '../../utils/passwordHandler.js';

export const createSeller = async ( req , res , next ) => {
    try {

        const supportManagerData = req.supportManagerData;
        const validatedData = createSellerSchema.safeParse(req.body);

        if(validatedData.error){
            return res.status(400).json({ 
                status: "error",
                message: "Unauthorized access",
            });
        };

        const search = await seller.exists({ "personalDetails.mobileNumber": validatedData.data.personalDetails.mobileNumber });

        if(search){
            return res.status(400).json({
                status: "error",
                message: "Seller already exists",
            });
        };

        const searchEmail = await seller.exists({ "personalDetails.email": validatedData.data.personalDetails.email });

        if(searchEmail){
            return res.status(400).json({
                status: "error",
                message: "Seller already exists",
            });
        };

        const hashedPassword = await hashPassword(validatedData.data.personalDetails.mobileNumber);

        const newSeller = new seller({
            ...validatedData.data,
            password: hashedPassword,
            supportOffice: supportManagerData.supportOffice._id,
        });

        await newSeller.save();

        const updateSupportOffice = await supportOffice.findByIdAndUpdate(
            supportManagerData.supportOffice._id,
            {
                $push: { sellers: newSeller._id }
            }
        );

        return res.status(200).json({
            status: "success",
            message: "Seller created successfully",
            data: newSeller,
        });

    } catch (error) {
        next(error);
    };
};

export const getAllSellers = async ( req , res , next ) => {
    try {

        const {
            page = 1,
            limit = 10,
        } = req.query;

        const supportManagerData = req.supportManagerData;

        const sellers = await seller.find({ supportOffice: supportManagerData.supportOffice._id })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .select("-password -address -supportOffice -bankAccount -documents -address -loggedIn -authentication")
        .exec();

        const totalCount = await seller.countDocuments({ supportOffice: supportManagerData.supportOffice._id });

        return res.status(200).json({
            status: "success",
            message: "Sellers fetched successfully",
            countDocuments: sellers.length,
            data: sellers,
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