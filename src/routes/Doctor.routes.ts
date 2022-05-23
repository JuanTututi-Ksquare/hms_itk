import {Request, Response, Router} from "express";
import { body, param } from "express-validator";
import { getDoctorAppointments, getDoctorAppointmentsByDate, getDoctorAppointmentsByPatient } from "../handlers/GetAppointments.handler";
import { UpdateAppointment } from "../handlers/UpdateAppointment.handler";
import { checkDoctorAssociation } from "../middlewares/Association.validator";
import { checkAuth } from "../middlewares/Auth.validator";
import { checkExistingAppointment, checkExistingDoctor } from "../middlewares/Exists.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const DoctorsRouter = Router();

DoctorsRouter.get(
    "/appointments",
    checkAuth,
    roleValidator(["doctor"]),
    checkExistingDoctor,
    async (req: Request, res: Response) => {
        const {id_doctor} = res.locals;
        if (req.query.date) {
            const date = <string>req.query.date;
            res.status(200).send(await getDoctorAppointmentsByDate(id_doctor, date))
        } else if (req.query.patient) {
            const id_patient = <string>req.query.patient;
            res.status(200).send(await getDoctorAppointmentsByPatient(id_doctor, +id_patient));
        } else {
            res.status(200).send(await getDoctorAppointments(id_doctor));
        }
    }
)

DoctorsRouter.patch(
    "/appointment/:id",
    body("date").exists().isDate().isAfter(),
    param("id").exists().isNumeric(),
    checkAuth,
    roleValidator(["doctor"]),
    checkExistingDoctor,
    checkExistingAppointment,
    checkDoctorAssociation,
    async (req: Request, res: Response) => {
        const { date } = req.body;
        const { id } = req.params;
        res.status(200).send(await UpdateAppointment(date, +id));
    }
)

