

export const getAccount = async ( req , res , next ) => {
    try {

        const data = req.adminData.toObject();

        delete data.authentication;
        delete data.loggedIn;
        delete data.password;
        delete data.isVerified;
        delete data.isBan;
        delete data.banReason;
        delete data._id;
        
        return res.status(200).send({
            status: 'success',
            message: 'Account details',
            data,
        });

    } catch (error) {
        next(error);
    };
};