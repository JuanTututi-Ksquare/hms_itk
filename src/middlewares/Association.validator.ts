import { Request, Response } from "express";
import { Appointments } from "../models/Appointments.model";
import { Patients } from "../models/Patients.model";

export const checkAssociation = async (req: Request, res: Response, next: Function) => {
    try {
        const patient = await Patients.findOne({
            where: {
                id_user: res.locals.uid 
            }
        })
        if (!patient) {
            return res.status(401).send({error: "Ups... something went wrong! :("})
        }
        const appointment = await Appointments.findOne({
            where: {
                id: req.params.id,
                id_patient: patient.id,
                status: true,
            }
        });
        if (!appointment || appointment === null) {
            return res.status(404).send({error: "Ups... something went wrong! :("})
        }
        return next();
    } catch (error) {
        return error;
    }
}