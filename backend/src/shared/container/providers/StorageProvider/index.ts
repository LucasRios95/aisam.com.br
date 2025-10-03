import { container } from "tsyringe";
import { IStorageProvider } from "./IStorageProvider";
import { LocalStorageProvider } from "./implementations/LocalStorageProvider";

container.registerSingleton<IStorageProvider>(
    "StorageProvider",
    LocalStorageProvider
);
