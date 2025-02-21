import branch from "../../models/branch.js";
import branchManager from "../../models/branchManager.js";
import regionalOffice from "../../models/regionalOffice.js";
import { hashPassword } from '../../utils/passwordHandler.js';
import { sendMail } from '../../utils/sendMail.js';
import { createBranchSchema , createBranchManagerSchema } from '../../utils/zodSchema.js';

export const createBranch = async (req, res) => {
    try {
        
        const regionalOfficerData = req.regionalOfficer;


        const validatedData = createBranchSchema.safeParse(req.body);

        if(validatedData.error) {
            return res.status(400).json({
                status: "error",
                message: "Unauthorized Access",
            });
        };

        const branchExist = await branch.exists({
            $or: [
                { branchName: validatedData.data.branchName },
                { branchEmail: validatedData.data.branchEmail },
            ],
        });

        if(branchExist) {
            return res.status(400).json({
                status: "error",
                message: "Branch already exist.",
            });
        };

        const newBranch = new branch({
            branchName: validatedData.data.branchName,
            branchEmail: validatedData.data.branchEmail,
            address: validatedData.data.address,
            regionalOffice: regionalOfficerData.regionalOffice,
        });

        await newBranch.save();

        await regionalOffice.findByIdAndUpdate(
            regionalOfficerData.regionalOffice,
            { $push: { branches: newBranch._id } },
        );

        regionalOfficerData.accountHistory.push({
            historyType: "branch",
            about: "Branch created : " + newBranch.branchName,
            relation: newBranch._id,
        });

        await regionalOfficerData.save();

        return res.status(201).json({
            status: "success",
            message: "Branch created successfully.",
            data: newBranch,
        });

    } catch (error) {
        console.log(error);
    };
};

export const getAllBranch = async ( req , res , next ) => {
    try {

        const {
            limit = 10,
            page = 1,
        } = req.query;

        const allBranch = await branch.find({
            regionalOffice: req.regionalOfficer.regionalOffice,
        })
        .select("-__v -address")
        .limit(parseInt(limit, 10))
        .skip(page > 0 ? ( ( page - 1 ) * limit ) : 0 );
        
        const totalCount = await branch.find({
            regionalOffice: req.regionalOfficer.regionalOffice,
        }).countDocuments();

        return res.status(200).json({
            status: "success",
            message: "All branches",
            countDocuments: allBranch.length,
            data: allBranch,
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

export const createBranchManager = async ( req , res , next ) => {
    try {
        
        const regionalOfficerData = req.regionalOfficer;

        const validatedData = createBranchManagerSchema.safeParse(req.body);

        if(validatedData.error) {
            return res.status(400).json({
                status: "error",
                message: "Unauthorized Access",
            });
        };

        const branchData = await branch.findById(validatedData.data.branchId);

        if(!branchData) {
            return res.status(404).json({
                status: "error",
                message: "Branch not found.",
            });
        };

        const branchManagerExist = await branchManager.exists({
            email: validatedData.data.email
        });

        if(branchManagerExist) {
            return res.status(400).json({
                status: "error",
                message: "Branch Manager already exist.",
            });
        };

        const hashedPassword = await hashPassword(validatedData.data.personalDetails.mobileNumber);

        const newBranchManager = new branchManager({
            branch: validatedData.data.branchId,
            personalDetails: validatedData.data.personalDetails,
            email: validatedData.data.email,
            password: hashedPassword,
            role: validatedData.data.role,
            address: validatedData.data.address,
        });

        await newBranchManager.save();

        branchData.managers = newBranchManager._id;
        await branchData.save();

        
        regionalOfficerData.accountHistory.push({
            historyType: "branch",
            about: "Branch manager created : " + newBranchManager.personalDetails.firstName,
            relation: newBranchManager._id,
        });

        await regionalOfficerData.save();

        return res.status(201).json({
            status: "success",
            message: "Branch Manager created successfully.",
            data: newBranchManager,
        });

    } catch (error) {
        next(error);
    };
};

export const getAllBranchManager = async ( req , res , next ) => {
    try {
        
        const {
            limit = 10,
            page = 1,
        } = req.query;

        const allBranchManager = await branchManager.find({
            regionalOffice: req.regionalOfficer.regionalOffice,
        })
        .select("-__v -address -loggedIn -authentication -password -accountHistory")
        .limit(parseInt(limit, 10))
        .skip(page > 0 ? ( ( page - 1 ) * limit ) : 0 );
        
        const totalCount = await branchManager.find({}).countDocuments();

        return res.status(200).json({
            status: "success",
            message: "All Branch managers",
            countDocuments: allBranchManager.length,
            data: allBranchManager,
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