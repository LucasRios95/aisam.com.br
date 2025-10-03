interface IStorageProvider {
    save(file: string, folder: string): Promise<string>;
    delete(file: string, folder: string): Promise<void>;
    getFileUrl(file: string, folder: string): string;
}

export { IStorageProvider };
