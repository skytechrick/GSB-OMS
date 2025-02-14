import mongoose from "mongoose";

export default async () => {
    try {
        const URL = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/${process.env.DATABASE_NAME}`;
        mongoose.connect(URL);

        const db = mongoose.connection;

        db.on("open", ()=> {
            console.log("MongoDB: Connected to database.");
        });

        db.on("error", (err)=> {
            console.error("MongoDB: Error", err);
            process.exit(1);
        });

        mongoose.Promise = global.Promise;
        
    } catch (error) {
        console.error("MongoDB: Error", error);
        process.exit(1);
    };
};