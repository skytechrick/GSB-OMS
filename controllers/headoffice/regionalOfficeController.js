
import regionalOffice from '../../models/regionalOffice.js';

import { createRegionalOfficeSchema } from '../../utils/zodSchema.js';

export const dashboard = async ( req , res , next ) => {
    try {
        
    } catch (error) {
        next(error);
    };
};

export const createRegionalOffice = async ( req , res , next ) => {
    try {

        const validatedData = createRegionalOfficeSchema.safeParse(req.body);
        if(validatedData.error) {
            return res.status(400).json({
                status: "error",
                message: "Unauthorized Access",
            });
        };
        const regionalOfficeExist = await regionalOffice.exists({
            $or: [
                { regionalOfficeName: validatedData.data.regionalOfficeName },
                { officialEmail: validatedData.data.officialEmail }
            ]
        });        

        if(regionalOfficeExist) {
            return res.status(400).json({
                status: "error",
                message: "Regional Office Already Exist",
            });
        };

        const newRegionalOffice = new regionalOffice({
            regionalOfficeName: validatedData.data.regionalOfficeName,
            officialEmail: validatedData.data.officialEmail,
            address: validatedData.data.address,
        });

        const savedRegionalOffice = await newRegionalOffice.save();

        return res.status(200).json({
            status: "success",
            message: "Regional Office Created Successfully",
            data: savedRegionalOffice,
        });
        
    } catch (error) {
        next(error);
    };
};

export const getAllRegionalOffices = async ( req , res , next ) => {
    try {

        const {
            limit = 10,
            page = 1,
        } = req.query;

        const allRegionalOffices = await regionalOffice.find({})
        .select("-__v -address")
        .limit(parseInt(limit, 10))
        .skip(page > 0 ? ( ( page - 1 ) * limit ) : 0 );
        
        const totalCount = await regionalOffice.find({}).countDocuments();

        return res.status(200).json({
            status: "success",
            message: "All Regional Offices",
            countDocuments: allRegionalOffices.length,
            data: allRegionalOffices,
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