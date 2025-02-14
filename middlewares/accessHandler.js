import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import morgan from "morgan";

export default (req, res, next) => {
    const folderPath = path.join(process.cwd(), "logs");
    const filePath = path.join(folderPath, "access.log");
    (async () => {
        try {
            await fsPromises.mkdir(folderPath, { recursive: true });
            await fsPromises.access(filePath).catch(() => fsPromises.writeFile(filePath, "", "utf8"));
        } catch (error) {
            console.error("Log file setup failed:", error);
        }
    })();
    const accessLogStream = fs.createWriteStream(filePath, { flags: "a" });
    return morgan("combined", { stream: accessLogStream })(req, res, next);
};
