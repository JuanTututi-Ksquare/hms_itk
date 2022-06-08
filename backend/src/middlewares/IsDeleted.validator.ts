import { Request, Response } from "express";
import { Users } from "../models/Users.model";

export const IsDeleted = async (req: Request, res: Response, next: Function) => {
    const {uid} = res.locals;
    try {
        const user = await Users.findOne({
            where: {
                id: uid,
                is_deleted: true
            }
        })
        if (user) {
            res.status(404).send({error: "User doesn't exists!"}); // exist*
        } else {
            return next();
        }
    } catch (error) {
        res.status(500).send({error: "Internal server error, please try again later!"});
    }
}