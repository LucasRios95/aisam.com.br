import fs from "fs";
import path from "path";
import { IStorageProvider } from "../IStorageProvider";

class LocalStorageProvider implements IStorageProvider {
    private uploadFolder: string;

    constructor() {
        this.uploadFolder = path.resolve(__dirname, "..", "..", "..", "..", "..", "tmp", "uploads");

        // Cria a pasta de uploads se não existir
        if (!fs.existsSync(this.uploadFolder)) {
            fs.mkdirSync(this.uploadFolder, { recursive: true });
        }
    }

    async save(file: string, folder: string): Promise<string> {
        const folderPath = path.join(this.uploadFolder, folder);

        // Cria a pasta específica se não existir
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        const tmpFolder = path.resolve(__dirname, "..", "..", "..", "..", "..", "tmp");
        const oldPath = path.join(tmpFolder, file);
        const newPath = path.join(folderPath, file);

        // Move o arquivo da pasta temporária para a pasta definitiva
        await fs.promises.rename(oldPath, newPath);

        return file;
    }

    async delete(file: string, folder: string): Promise<void> {
        const filePath = path.join(this.uploadFolder, folder, file);

        try {
            await fs.promises.stat(filePath);
            await fs.promises.unlink(filePath);
        } catch (error) {
            // Arquivo não existe, não faz nada
        }
    }

    getFileUrl(file: string, folder: string): string {
        // Retorna a URL relativa do arquivo
        return `/files/${folder}/${file}`;
    }
}

export { LocalStorageProvider };
