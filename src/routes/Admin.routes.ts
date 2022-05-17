import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { CreateDoctor } from "../handlers/CreateDoctor.handler";

export const AdminRouter = Router();

AdminRouter.post(
  "/create-doctor",
  //   First and last name must be at least 2 chars long
  body("first_name").isLength({ min: 2 }),
  body("last_name").isLength({ min: 2 }),
  //   Birthdate must be before current date
  body("birthdate").isDate().isBefore(),
  //   Email has to be on correct format
  body("email").isEmail(),
  //   Password must be at least 6 chars
  body("password").isLength({ min: 6 }),
  body("license").isLength({min: 10, max:10}),
  body("id_area").isInt({min: 1, max:9}),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const { first_name, last_name, birthdate, email, password, license, id_area } = req.body;
    res.send(await CreateDoctor(first_name, last_name, birthdate, email, password, license, id_area));
  }
);

AdminRouter.post(
  "/list-doctors",
  async (req: Request, res: Response) => {
    res.send("Create appointment middleware");
  }
);

AdminRouter.get("/list-patients", async (req: Request, res: Response) => {
  res.send("Get appointments middleware");
});