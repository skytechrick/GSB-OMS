import multer from 'multer';
import path from 'path';
import fs from 'fs';

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const pathFolder = path.join(process.cwd(), './public/tempImages');
        if (!fs.existsSync(pathFolder)) {
            fs.mkdirSync(pathFolder, { recursive: true });
        }
        cb(null, pathFolder);
    },
    filename: (req, file, cb) => {
        const f = `${req.body.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50)}-${Date.now()}-${file.originalname}`;
        cb(null, f);
    }
});

const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];

    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type. Only images are allowed.'));
    };
};

const uploadProductImages = multer({
    storage: productStorage,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter: imageFileFilter,
});

export const uploadProductMiddleware = uploadProductImages.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
    { name: 'img4', maxCount: 1 },
    { name: 'img5', maxCount: 1 },
    { name: 'img6', maxCount: 1 },
    { name: 'img7', maxCount: 1 }
]);



const categoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const pathFolder = path.join(process.cwd(), './public/category-images');
        if (!fs.existsSync(pathFolder)) {
            fs.mkdirSync(pathFolder, { recursive: true });
        }
        cb(null, pathFolder);
    },
    filename: (req, file, cb) => {
        const f = `${req.body.name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50)}-${Date.now()}-${file.originalname}`;
        cb(null, f);
    }
});

const categoryImageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];

    if(allowedTypes.includes(file.mimetype)){
        cb(null, true)
    }else{
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type. Only images are allowed.'));
    };
};

const uploadCategoryImages = multer({
    storage: categoryStorage,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter: categoryImageFileFilter,
});

export const uploadCategoryMiddleware = uploadCategoryImages.fields([
    { name: 'image', maxCount: 1 },
]);