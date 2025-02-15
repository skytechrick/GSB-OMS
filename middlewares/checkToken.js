
export default async ( req , res , next ) => {
    try {

        const isWeb = req.isWeb;
        req.token = null;
        if (isWeb) {
            if (req.signedCookies.token) {
                req.token = req.signedCookies.token;
            };
        }else{
            if (req.headers.Authorization) {
                const token = req.headers.Authorization.split(' ')[1];
                req.token = token;
            };
        };
        
        next();

    } catch (error) {
        next(error);
    };
};