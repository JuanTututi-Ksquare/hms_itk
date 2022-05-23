import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { CreateAppointment } from "../handlers/CreateAppointment.handler";
import { CreatePatient } from "../handlers/CreatePatient.handler";
import { deletePatientAppointment } from "../handlers/DeleteAppointments.handler";
import { getPatientAppointments, getSinglePatientAppointment } from "../handlers/GetAppointments.handler";
import { checkPatientAssociation } from "../middlewares/Association.validator";
import { checkAuth } from "../middlewares/Auth.validator";
import {
  checkExistingAppointment,
  checkExistingDoctor,
  checkExistingPatient,
} from "../middlewares/Exists.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const PatientRouter = Router();

// Sign Up
PatientRouter.post(
  "/",
  //   First and last name must be at least 2 chars long
  body("first_name").exists().isLength({ min: 2 }),
  body("last_name").exists().isLength({ min: 2 }),
  //   Birthdate must be before current date
  body("birthdate").exists().isDate().isBefore(),
  //   Email has to be on correct format
  body("email").exists().isEmail(),
  //   Password must be at least 6 chars
  body("password").exists().isLength({ min: 6 }),
  body("curp").exists().isString().isLength({ min: 18, max: 18 }),
  // Check if user is not deleted

  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // return res.status(422).json({ errors: errors.array() });
      return res
        .status(400)
        .send({ error: "Input error: Please verify the payload!" });
    }
    const { first_name, last_name, birthdate, email, password, curp, role } =
      req.body;
    if (role !== "patient") {
      return res.status(400).send({ error: "Something went wrong" });
    }
    try {
      const createdPatient = await CreatePatient(
        first_name,
        last_name,
        birthdate,
        email,
        password,
        curp,
        role
      );
      return res.status(201).send({ createdPatient });
    } catch (error) {
      return res.status(500).send({ error: "Something went wrong" });
    }
  }
);

// Create Appointment
PatientRouter.post(
  "/appointment",
  body("id_doctor").exists().isInt(),
  body("date").exists().toDate().isAfter(),
  checkAuth,
  roleValidator(["patient"]),
  // Check if the patient exists
  checkExistingPatient,
  // Check if the doctor exists
  checkExistingDoctor,
  // Check if there's no conflict with other appointment date
  checkExistingAppointment,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .send({ error: "Input error: Please verify the payload!" });
    }
    const { id_doctor, date } = req.body;
    const { id_patient } = res.locals;
    res.status(201).send(await CreateAppointment(id_doctor, id_patient, date));
  }
);

// Get all appointments
PatientRouter.get(
  "/appointments",
  checkAuth,
  roleValidator(["patient"]),
  checkExistingPatient,
  async (req: Request, res: Response) => {
    const { uid } = res.locals;
    res.status(200).send(await getPatientAppointments(uid));
  }
);

PatientRouter.get(
  "/appointment/:id",
  checkAuth,
  roleValidator(["patient"]),
  checkPatientAssociation,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(200).send(await getSinglePatientAppointment(+id))
  }
)

// Delete an appointment
PatientRouter.delete(
  "/appointment/:id",
  checkAuth,
  roleValidator(["patient"]),
  checkPatientAssociation,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    res.status(200).send(await deletePatientAppointment(+id));
  }
);
