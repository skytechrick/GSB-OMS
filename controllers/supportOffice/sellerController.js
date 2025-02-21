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

    } catch (error) {
        next(error);
    };
};