import supportOffice from "../../models/supportOffice.js"
import branch from "../../models/branch.js"
import { hashPassword } from "../../utils/passwordHandler.js"
import { sendMail } from '../../utils/sendMail.js';
import supportManager from "../../models/supportManager.js"
import { createSupportOfficeSchema , createSupportManagerSchema } from "../../utils/zodSchema.js";

export const createSupportOffice = async ( req , res , next ) => {
    try {

        const branchManagerData = req.branchManagerData;

        const validatedData = createSupportOfficeSchema.safeParse(req.body);

        if(validatedData.error) {
            return res.status(400).json({
                status: "error",
                message: "Unauthorized Access",
            });
        };

        const supporOfficeExist = await supportOffice.exists({
            $or: [
                { branchName: validatedData.data.branchName },
                { branchEmail: validatedData.data.branchEmail },
            ],
        });

        if(supporOfficeExist) {
            return res.status(400).json({
                status: "error",
                message: "Branch already exist.",
            });
        };

        const newSupportOffice = new supportOffice({
            supportOfficeName: validatedData.data.supportOfficeName,
            supportOfficeEmail: validatedData.data.supportOfficeEmail,
            address: validatedData.data.address,
            branch: branchManagerData.branch,
        });

        await newSupportOffice.save();

        await branch.findByIdAndUpdate(
            branchManagerData.branch,
            { $push: { supportOffices: newSupportOffice._id } },
        );

        branchManagerData.accountHistory.push({
            historyType: "support",
            about: "support office created : " + newSupportOffice.supportOfficeName,
            relation: newSupportOffice._id,
        });

        await branchManagerData.save();

        return res.status(201).json({
            status: "success",
            message: "Branch created successfully.",
            data: newSupportOffice,
        });

    } catch (error) {
        next(error);
    };
};

export const getAllsupportOffices = async ( req , res , next ) => {
    try {
        
        
        const {
            limit = 10,
            page = 1,
        } = req.query;

        const allSupportOffice = await supportOffice.find({
            branch: req.branchManagerData.branch,
        })
        .select("-__v -address")
        .limit(parseInt(limit, 10))
        .skip(page > 0 ? ( ( page - 1 ) * limit ) : 0 );
        
        const totalCount = await supportOffice.find({}).countDocuments();

        return res.status(200).json({
            status: "success",
            message: "All support offices fetched successfully.",
            countDocuments: allSupportOffice.length,
            data: allSupportOffice,
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


export const createSupportManager = async ( req , res , next ) => {
    try {
        
        const branchManagerData = req.branchManagerData;

        const validatedData = createSupportManagerSchema.safeParse(req.body);

        if(validatedData.error) {
            return res.status(400).json({
                status: "error",
                message: "Unauthorized Access",
            });
        };

        const supportOfficeExist = await supportOffice.exists({
            _id: validatedData.data.supportOfficeId,
        });

        if(!supportOfficeExist) {
            return res.status(400).json({
                status: "error",
                message: "Support Office does not exist.",
            });
        };

        const supportManagerExist = await supportManager.exists({
            email: validatedData.data.email
        });

        if(supportManagerExist) {
            return res.status(400).json({
                status: "error",
                message: "Support Manager already exist.",
            });
        };

        const hashedPassword = await hashPassword(validatedData.data.personalDetails.mobileNumber);

        const newSupportManager = new supportManager({
            supportOffice: validatedData.data.supportOfficeId,
            personalDetails: validatedData.data.personalDetails,
            email: validatedData.data.email,
            password: hashedPassword,
            role: validatedData.data.role,
            address: validatedData.data.address,
        });

        await newSupportManager.save();

        const supportOfficeData = await supportManager.findByIdAndUpdate(validatedData.data.supportOfficeId,
            { $push: { supportManagers: newSupportManager._id } },
        );

        
        branchManagerData.accountHistory.push({
            historyType: "support",
            about: "Support manager created : " + newSupportManager.personalDetails.firstName,
            relation: newSupportManager._id,
        });

        await branchManagerData.save();

        return res.status(201).json({
            status: "success",
            message: "Support Manager created successfully.",
            data: newSupportManager,
        });


    } catch (error) {
        next(error);
    };
};

export const getAllSupportManager = async ( req , res , next ) => {
    try {
        
        const branchManagerData = req.branchManagerData;

        const {
            limit = 10,
            page = 1,
        } = req.query;

        const allSupportManager = await supportManager
        .find({
            supportOffice: {
                $in: [
                    ...branchManagerData.branch.supportOffices.map(id => id.toString()),
                ]
            }
        })
        .select("-__v -address -password -loggedIn -authentication -accountHistory")
        .limit(parseInt(limit, 10))
        .skip(page > 0 ? ( ( page - 1 ) * limit ) : 0 );

        const totalCount = await supportManager.find({}).countDocuments();

        return res.status(200).json({
            status: "success",
            message: "All support managers fetched successfully.",
            countDocuments: allSupportManager.length,
            data: allSupportManager,
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