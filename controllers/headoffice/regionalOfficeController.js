
import regionalOffice from '../../models/regionalOffice.js';
import regionalOfficer from '../../models/regionalOfficer.js';
import { sendMail } from '../../utils/sendMail.js';
import { createRegionalOfficeSchema , createRegionalOfficerSchema } from '../../utils/zodSchema.js';
import { hashPassword } from '../../utils/passwordHandler.js';

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
        .select("-__v")
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

export const createRegionalOfficer = async ( req , res , next ) => {
    try {

        const validatedData = createRegionalOfficerSchema.safeParse(req.body);

        if(validatedData.error) {
            return res.status(400).json({
                status: "error",
                message: "Unauthorized Access",
            });
        };

        const regionalOfficeExist = await regionalOffice.exists({
            _id: validatedData.data.regionalOfficeId,
        });

        if(!regionalOfficeExist) {
            return res.status(400).json({
                status: "error",
                message: "Regional Office Not Found",
            });
        };

        const regionalOfficerExist = await regionalOfficer.exists({
            email: validatedData.data.email,
        });

        if(regionalOfficerExist) {
            return res.status(400).json({
                status: "error",
                message: "Regional Officer Already Exist",
            });
        };

        const isMailSent = sendMail({
            from: `No-reply <${process.env.NO_REPLY_MAIL_ID}>`,
            to: validatedData.data.email,
            subject: "Account Created | GET SKY BUY",
            html: `<h1>Account Created</h1><p>Your Account has been created successfully</p>`,
        });

        if(!isMailSent) {
            return res.status(400).json({
                status: "error",
                message: "Unable to send mail",
            });
        };

        const newRegionalOfficer = new regionalOfficer({
            password: await hashPassword(validatedData.data.personalDetails.mobileNumber),
            regionalOffice: validatedData.data.regionalOfficeId,
            personalDetails: validatedData.data.personalDetails,
            email: validatedData.data.email,
            role: validatedData.data.role,
            address: validatedData.data.address,
            regionalOffice: validatedData.data.regionalOfficeId,
        });

        const savedRegionalOfficer = (await newRegionalOfficer.save());

        await regionalOffice.findByIdAndUpdate(validatedData.data.regionalOfficeId, 
            {
                $push: {
                    regionalOfficers: savedRegionalOfficer._id,
                }
            },
        );

        const responseData = savedRegionalOfficer.toObject();
        delete responseData.password;
        delete responseData.loggedIn;
        delete responseData.authentication;
        delete responseData.accountHistory;

        return res.status(200).json({
            status: "success",
            message: "Regional Officer Created Successfully",
            data: responseData,
        });

    } catch (error) {
        next(error);
    };
};

export const getAllRegionalOfficer = async ( req , res , next ) => {
    try {
        
        const {
            limit = 10,
            page = 1,
        } = req.query;

        const allRegionalOfficers = await regionalOfficer.find({})
        .select("-__v -address -loggedIn -authentication -password -accountHistory")
        .limit(parseInt(limit, 10))
        .skip(page > 0 ? ( ( page - 1 ) * limit ) : 0 );
        
        const totalCount = await regionalOfficer.find({}).countDocuments();

        return res.status(200).json({
            status: "success",
            message: "All Regional Officers",
            countDocuments: allRegionalOfficers.length,
            data: allRegionalOfficers,
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

export const getRegionalOfficeById = async ( req , res , next ) => {
    try {

        const { id } = req.params;

        const regionalOfficeData = await regionalOffice
        .findById(id)
        .populate("regionalOfficers branches")
        .select("-__v")
        .exec();

        if(!regionalOfficeData) {
            return res.status(400).json({
                status: "error",
                message: "Regional Office Not Found",
            });
        };

        return res.status(200).json({
            status: "success",
            message: "Regional Office",
            data: regionalOfficeData,
        });

    } catch (error) {
        next(error);
    };
};
