
export const login = async ( req , res , next ) => {
    try {

        return res.status(201).json({
            status: 'success',
            message: 'OTP sent successfully',
        });
        
    } catch (error) {
        next(error);
    };
};

export const loginVerifyOtp = async ( req , res , next ) => {
    try {

        return res.status(200).json({
            status: 'success',
            message: 'Login successfully',
        });

    } catch (error) {
        next(error);
    };
};