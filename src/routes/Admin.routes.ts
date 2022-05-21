import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { CreateDoctor } from "../handlers/CreateDoctor.handler";
import { GetAppointments } from "../handlers/GetAppointments.handler";
import { checkAuth } from "../middlewares/Auth.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const AdminRouter = Router();

AdminRouter.post(
  "/create-doctor",
  checkAuth,
  roleValidator({roles: ["admin"], allowSameUser: true}),
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
  body("role").exists().isString(),
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
    return res.send(
      await CreateDoctor(
        first_name,
        last_name,
        birthdate,
        license,
        id_area,
        email,
        password,
        role
      )
    );
  }
);

AdminRouter.get("/appointments", async (req: Request, res: Response) => {
  res.send(await GetAppointments());
});

AdminRouter.get("/doctors", async (req: Request, res: Response) => {
  res.send("Create appointment middleware");
});

AdminRouter.get("/patients", async (req: Request, res: Response) => {
  res.send("Get appointments middleware");
});
