
export default async ( req , res , next ) => {
    try {

        const isWeb = req.isWeb;
        
        if (isWeb) {

            if (!req.signedCookies.token) {
                return res.status(401).send({
                    status: 'error',
                    message: 'Unauthorized access',
                });
            };
            req.token = req.signedCookies.token;

        }else{
            if (!req.headers.Authorization) {
                return res.status(401).send({
                    status: 'error',
                    message: 'Unauthorized access',
                });
            };

            const token = req.headers.Authorization.split(' ')[1];

            req.token = token;
        };

        next();

    } catch (error) {
        next(error);
    };
};