import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { ActivateUser } from "../handlers/ActivateUser.handler";
import { CreateDoctor } from "../handlers/CreateDoctor.handler";
import {
  getAllAppointments,
  getAllAppointmentsByDoctor,
  getAllAppointmentsByPatient,
} from "../handlers/GetAppointments.handler";
import { checkAuth } from "../middlewares/Auth.validator";
import { checkInactiveUser } from "../middlewares/Exists.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const AdminRouter = Router();

// Create a Doctor
AdminRouter.post(
  "/doctors",
  checkAuth,
  roleValidator(["admin"]),
  //   First and last name must be at least 2 chars long
  body("first_name").exists().isLength({ min: 2 }),
  body("last_name").exists().isLength({ min: 2 }),
  //   Birthdate must be before current date
  body("birthdate").exists().isDate().isBefore(),
  //   Email has to be on correct format
  body("email").exists().isEmail(),
  //   Password must be at least 6 chars
  body("password").exists().isLength({ min: 6 }),
  body("license").exists().isLength({ min: 10, max: 10 }),
  body("id_area").exists().isInt({ min: 1, max: 9 }),
  body("role").exists().isString().matches("doctor"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const {
      first_name,
      last_name,
      birthdate,
      email,
      password,
      license,
      id_area,
      role,
    } = req.body;
    if (role !== "doctor") {
      return res.status(400).send("Something went wrong :(");
    }
    try {
      const doctor = await CreateDoctor(
        first_name,
        last_name,
        birthdate,
        license,
        id_area,
        email,
        password,
        role
      );
      res.status(201).send(doctor);
    } catch (error) {
      res
        .status(500)
        .send({ error: "Internal server error, please try again later!" });
    }
  }
);

// Activate User
AdminRouter.patch(
  "/users",
  checkAuth,
  roleValidator(["admin"]),
  body("id_user").exists().isNumeric(),
  checkInactiveUser,
  async (req: Request, res: Response) => {
    const { id_user } = req.body;
    try {
      const user = await ActivateUser(id_user);
      res.status(200).send(user);
    } catch (error) {
      res.status(500).send({error: "Internal server error, please try again later!"})
    } 
  }
);

// Get appointments
AdminRouter.get(
  "/appointments",
  checkAuth,
  roleValidator(["admin"]),
  async (req: Request, res: Response) => {
    try {
      if (typeof req.query.patient === "string") {
        const id_patient = <string>req.query.patient;
        const appointments = await getAllAppointmentsByPatient(+id_patient);
        res.status(200).send(appointments);
      } else if (typeof req.query.doctor === "string") {
        const id_doctor = req.query.doctor;
        const appointments = await getAllAppointmentsByDoctor(+id_doctor);
        res.status(200).send(appointments);
      } else {
        const appointments = await getAllAppointments()
        res.status(200).send(appointments);
      }
    } catch (error) {
      res.status(500).send({error: "Internal server error, please try again later!"})
    }
  }
);

AdminRouter.get("/doctors", async (req: Request, res: Response) => {
  res.send("Create appointment middleware");
});

AdminRouter.get("/patients", async (req: Request, res: Response) => {
  res.send("Get appointments middleware");
});
