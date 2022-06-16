import { NextFunction, Request, Response } from "express";
import { internalServerError } from "../config/CustomRespones";
import { Users } from "../models/Users.model";

export const IsDeleted = async (req: Request, res: Response, next: NextFunction) => {
    const {uid} = res.locals;
    try {
        const user = await Users.findOne({
            where: {
                id: uid,
                is_deleted: true
            }
        })
        if (user) {
            res.status(404).json({error: "User doesn't exists!"});
        } else {
            return next();
        }
    } catch (error) {
        res.status(500).json(internalServerError);
    }
}