import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { CreateAppointment } from "../handlers/CreateAppointment.handler";
import { CreatePatient } from "../handlers/CreatePatient.handler";
import { checkAuth } from "../middlewares/Auth.validator";
import { checkExistingAppointment, checkExistingDoctor, checkExistingPatient } from "../middlewares/Exists.validator";
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
  // Check if there's no user with same email

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
  "/create-appointment",
  body("id_doctor").exists().isInt(),
  body("date").exists().isISO8601().toDate(),
  checkAuth,
  roleValidator({roles: ["patient"], allowSameUser: true}),
  // Check if the patient exists
  checkExistingPatient,
  // Check if the doctor exists
  checkExistingDoctor,
  // Check if there's no conflict with other appointment date
  checkExistingAppointment,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
      // return res
      //   .status(400)
      //   .send({ error: "Input error: Please verify the payload!" });
    }
    const { id_doctor, date } = req.body;
    const id_patient = +req.params.id;
    res.send(await CreateAppointment(id_doctor, id_patient, date));
  }
);

PatientRouter.get("/get-appointments", async (req: Request, res: Response) => {
  res.send("Get appointments middleware");
});
