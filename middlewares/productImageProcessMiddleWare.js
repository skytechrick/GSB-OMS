import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const processImage = async (fileName) => {
    try {
        const inputPath = path.join(process.cwd(), './public/tempImages', fileName);
        const outputFilePath = path.join(process.cwd(), './public/product-images', `${path.parse(fileName).name}-${Date.now()}-saved.webp`);

        let image = sharp(inputPath);
        const metaData = await image.metadata();
        const maxSize = Math.max(metaData.width, metaData.height, 800);
        const quality = metaData.width * metaData.height > 2000000 ? 83 : 92;

        await image
            .resize({
                width: maxSize,
                height: maxSize,
                fit: 'contain',
                background: {
                    r: 255,
                    g: 255,
                    b: 255,
                    alpha: 1
                },
            })
            .flatten({
                background: {
                    r: 255,
                    g: 255,
                    b: 255,
                    alpha: 1
                },
            }).toFormat('webp', {
                quality
            }).toFile(outputFilePath)
        
        return path.basename(outputFilePath);
    } catch (error) {
        throw error;
    };
};

export const productImageProcessMiddleWare = async ( req , res , next ) => {
    const processedImages = [];

    try {
        if (!req.files) {
            return res.status(400).json({
                status: "fail",
                message: "No images were uploaded"
            });
        };
        
        const files = req.files;
        const imageProcessingPromises = [];

        for (let i = 1; i <= 7; i++) {
            const imageField = `img${i}`;

            if (files[imageField] && files[imageField][0]) {
                const fileName = files[imageField][0].filename;

                imageProcessingPromises.push(
                    processImage(fileName).then((processedImage) => {
                        processedImages.push({
                            field: imageField,
                            image: processedImage,
                        });
                    })
                );
            };
        };

        await Promise.all(imageProcessingPromises);

        req.processedImages = processedImages;
        next();
    } catch (error) {
        req.isProductImageUploaded = true;
        req.deleteFiles = files;
        req.convertedImages = processedImages;
        next(error);
    };
};