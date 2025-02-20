import supportOffice from "../../models/supportOffice.js"
import branch from "../../models/branch.js"
import { createSupportOfficeSchema } from "../../utils/zodSchema.js";

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