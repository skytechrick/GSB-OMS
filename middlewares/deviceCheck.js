
export default async ( req , res , next ) => {
    try {
        req.isWeb = req.headers["user-agent"]?.includes("Mozilla");
        next();
    } catch (error) {
        next(error);
    };
};