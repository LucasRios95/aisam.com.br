import "reflect-metadata"

import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";

import createConnection from "../typeorm";
import "../../container";


import { router } from "./routes";
import { AppError } from "../../errors/AppError";

createConnection();
const app = express();

app.use(express.json());

app.use(router);

app.use(
    (err: Error, request: Request, response: Response, next: NextFunction) => {

        if (err instanceof AppError) {
            return response.status(err.statusCode).json({
                error: err.message
            });
        }

        return response.status(500).json({
            status: "error",
            message: `internal server error - ${err.message}`
        });

        next();
    }
);

export { app };