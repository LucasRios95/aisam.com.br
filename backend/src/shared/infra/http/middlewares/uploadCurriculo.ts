import multer from "multer";
import path from "path";
import crypto from "crypto";

const tmpFolder = path.resolve(__dirname, "..", "..", "..", "..", "tmp");

export default {
    upload(folder: string) {
        return {
            storage: multer.diskStorage({
                destination: tmpFolder,
                filename: (request, file, callback) => {
                    const fileHash = crypto.randomBytes(16).toString("hex");
                    const fileName = `${fileHash}-${file.originalname}`;

                    return callback(null, fileName);
                }
            }),
            fileFilter: (request: any, file: any, callback: any) => {
                const allowedMimes = ["application/pdf"];

                if (allowedMimes.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new Error("Formato de arquivo inválido. Apenas PDF é permitido."));
                }
            },
            limits: {
                fileSize: 10 * 1024 * 1024 // 10MB
            }
        };
    }
};
