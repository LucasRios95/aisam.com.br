import { container } from "tsyringe";
import { IHashProvider } from "./IHashProvider";
import { BCryptHashProvider } from "./implementations/BCryptHashProvider";

container.registerSingleton<IHashProvider>(
    "HashProvider",
    BCryptHashProvider
);
