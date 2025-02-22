import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/productImages');
    },
    filename: (req, file, cb) => {
        cb(null, `${req.body.title.slice(0, 40)}-${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Invalid file type. Only images are allowed.'));
    };
};
  

const uploadProductImages = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter,
});

const uploadProductMiddleware = uploadProductImages.fields([
    { name: 'img1', maxCount: 1 },
    { name: 'img2', maxCount: 1 },
    { name: 'img3', maxCount: 1 },
    { name: 'img4', maxCount: 1 },
    { name: 'img5', maxCount: 1 },
    { name: 'img6', maxCount: 1 },
    { name: 'img7', maxCount: 1 }
]);

export default uploadProductMiddleware;
