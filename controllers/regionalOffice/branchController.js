import branch from "../../models/branch.js";
import regionalOffice from "../../models/regionalOffice.js";
import { hashPassword } from '../../utils/passwordHandler.js';
import { sendMail } from '../../utils/sendMail.js';
import { createBranchSchema } from '../../utils/zodSchema.js';

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

        const allBranch = await branch.find({})
        .select("-__v -address")
        .limit(parseInt(limit, 10))
        .skip(page > 0 ? ( ( page - 1 ) * limit ) : 0 );
        
        const totalCount = await branch.find({}).countDocuments();

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