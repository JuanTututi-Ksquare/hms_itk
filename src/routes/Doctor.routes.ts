import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import {
  getDoctorAppointments,
  getDoctorAppointmentsByDate,
  getDoctorAppointmentsByPatient,
} from "../handlers/GetAppointments.handler";
import { UpdateAppointmentDate } from "../handlers/UpdateAppointment.handler";
import { checkDoctorAssociation } from "../middlewares/Association.validator";
import { checkAuth } from "../middlewares/Auth.validator";
import {
  checkExistingAppointment,
  checkExistingDoctor,
} from "../middlewares/Exists.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const DoctorsRouter = Router();

DoctorsRouter.get(
  "/appointments",
  checkAuth,
  roleValidator(["doctor"]),
  checkExistingDoctor,
  async (req: Request, res: Response) => {
    const { id_doctor } = res.locals;
    try {
      if (req.query.date) {
        const date = <string>req.query.date;
        const appointments = await getDoctorAppointmentsByDate(id_doctor, date);
        res.status(200).send(appointments);
      } else if (req.query.patient) {
        const id_patient = <string>req.query.patient;
        const appointments = await getDoctorAppointmentsByPatient(
          id_doctor,
          +id_patient
        );
        res.status(200).send(appointments);
      } else {
        const appointments = await getDoctorAppointments(id_doctor);
        res.status(200).send(appointments);
      }
    } catch (error) {
      res
        .status(500)
        .send({ error: "Internal server error, please try again later!" });
    }
  }
);

DoctorsRouter.patch(
  "/appointments/:id",
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
    try {
      const appointment = await UpdateAppointmentDate(date, +id);
      res.status(200).send(appointment);
    } catch (error) {
      res
        .status(500)
        .send({ error: "Internal server error, please try again later!" });
    }
  }
);
