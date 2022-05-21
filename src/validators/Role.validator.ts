import { Request, Response } from "express";
import { Role } from "../config/CustomTypes";

export const roleValidator = (options: {roles: Role[], allowSameUser: boolean}) => {
    return(req: Request, res: Response, next: Function) => {
        const {uid, email, role} = res.locals;

        if (email === process.env.SUPER_USER) {
            return next()
        }

        if (!options.roles.includes(role)) {
            return res.status(403).send("Ups!, something went wrong :(");
        }

        return next();
    }
} 