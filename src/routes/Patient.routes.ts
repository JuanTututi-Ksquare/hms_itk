import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
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
    const { first_name, last_name, birthdate, email, password, curp } = req.body;
    res.send(await CreatePatient(first_name, last_name, birthdate, email, password, curp));
  }
);

PatientRouter.post(
  "/create-appointment",
  async (req: Request, res: Response) => {
    res.send("Create appointment middleware");
  }
);

PatientRouter.get("/get-appointments", async (req: Request, res: Response) => {
  res.send("Get appointments middleware");
});
