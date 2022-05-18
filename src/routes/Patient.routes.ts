import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { CreateAppointment } from "../handlers/CreateAppointment.handler";
import { CreatePatient } from "../handlers/CreatePatient.handler";

export const PatientRouter = Router();

PatientRouter.post(
  "/create-patient",
  //   First and last name must be at least 2 chars long
  body("first_name").isLength({ min: 2 }),
  body("last_name").isLength({ min: 2 }),
  //   Birthdate must be before current date
  body("birthdate").isDate().isBefore(),
  //   Email has to be on correct format
  body("email").isEmail(),
  //   Password must be at least 6 chars
  body("password").isLength({ min: 6 }),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { first_name, last_name, birthdate, email, password, curp, role } = req.body;
    if(role != "patient") {
      return res.status(400).send({error: "Something went wrong"});
    }
    try {
      const createdPatient = await CreatePatient(first_name, last_name, birthdate, email, password, curp, role);
      return res.status(201).send({createdPatient});
    } catch (error) {
      return res.status(500).send({error: "Something went wrong"});
    }
  }
);

PatientRouter.post(
  "/create-appointment",
  async (req: Request, res: Response) => {
    const {id_doctor, id_patient, date} = req.body;
    res.send(await CreateAppointment(id_doctor, id_patient, date));
  }
);

PatientRouter.get("/get-appointments", async (req: Request, res: Response) => {
  res.send("Get appointments middleware");
});
