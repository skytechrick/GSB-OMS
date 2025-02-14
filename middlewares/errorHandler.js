import fs from 'fs/promises';
import path from 'path';

const errorMiddleware = async ( error , req , res , next ) => {
    try {
        const folderPath = path.join(process.cwd(), './logs');
        const filePath = path.join(folderPath, 'internalServerError.log');
        
        try {
            await fs.access(folderPath);
        } catch {
            await fs.mkdir(folderPath, { recursive: true });
        };
        
        try {
            await fs.access(filePath);
        } catch {
            await fs.writeFile(filePath, '', 'utf8');
        };

        const errorLog = `Error: Something went wrong. Time: ${new Date().toLocaleTimeString()} - ${new Date().toDateString()}\n` + `${error.stack || error.message || 'No stack trace available'}\n\n`;
        await fs.appendFile(filePath, errorLog, 'utf8');

        return res.status(500).send({
            status: 'error',
            message: process.env.NODE_ENV === 'production' ? 'Something went wrong, internal server error' : error.message,
        });
        
    } catch (logError) {
        return res.status(500).send({
            status: 'error',
            message: process.env.NODE_ENV === 'production' ? 'Something went wrong, internal server error' : error.message,
        });
    };
};

export default errorMiddleware;