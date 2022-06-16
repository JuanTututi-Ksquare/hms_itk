import { Router, Request, Response } from "express";
import { body, query, param, validationResult } from "express-validator";
import { badRequest, internalServerError } from "../config/CustomRespones";
import { Pagination } from "../config/CustomTypes";
import { CreateAppointment } from "../handlers/CreateAppointment.handler";
import { CreatePatient } from "../handlers/CreatePatient.handler";
import { deletePatientAppointment } from "../handlers/DeleteAppointments.handler";
import {
  getPatientAppointments,
  getSinglePatientAppointment,
} from "../handlers/GetAppointments.handler";
import { checkPatientAssociation } from "../middlewares/Association.validator";
import { checkAuth } from "../middlewares/Auth.validator";
import {
  checkExistingAppointment,
  checkExistingDoctor,
  checkExistingPatient,
} from "../middlewares/Exists.validator";
import { IsDeleted } from "../middlewares/IsDeleted.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const PatientRouter = Router();

// Sign Up
PatientRouter.post(
  "/",
  //   First and last name must be at least 2 chars long
  body("first_name")
    .exists()
    .withMessage("First name is missing")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 chars long"),
  body("last_name")
    .exists()
    .withMessage("Last name is missing")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 chars long"),
  //   Birthdate must be before current date
  body("birthdate")
    .exists()
    .withMessage("Birthdate is missing")
    .isDate()
    .withMessage("Birthdate must be a valid date")
    .isBefore()
    .withMessage("Birthdate must be a past date"),
  //   Email has to be on correct format
  body("email")
    .exists()
    .withMessage("Email is missing")
    .isEmail()
    .withMessage("Email is not valid"),
  //   Password must be at least 6 chars
  body("password")
    .exists()
    .withMessage("Password is missing")
    .isLength({ min: 8 })
    .withMessage("Password must be a least 8 chars long"),
  body("curp")
    .exists()
    .withMessage("CURP is missing")
    .isString()
    .withMessage("CURP must be a string")
    .isLength({ min: 18, max: 18 })
    .withMessage("CURP must be 18 chars long"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ ...badRequest, errors: errors.array() });
    }
    const { first_name, last_name, birthdate, email, password, curp } =
      req.body;
    try {
      return res.json(
        await CreatePatient(
          first_name,
          last_name,
          birthdate,
          email,
          password,
          curp
        )
      );
    } catch (error) {
      return res.status(500).json(internalServerError);
    }
  }
);

// Create Appointment
PatientRouter.post(
  "/appointments",
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["patient"]),
  body("id_doctor")
    .exists()
    .withMessage("Doctor ID is missing from request body")
    .isInt()
    .withMessage("Doctor ID must be an integer"),
  body("date")
    .exists()
    .withMessage("Date is missing from request body")
    .toDate()
    .isAfter()
    .withMessage("Date is not valid"),
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
        .json({ ...badRequest, errors: errors.array() });
    }
    const { id_doctor, date } = req.body;
    const { id_patient } = res.locals;
    try {
      const appointment = await CreateAppointment(id_doctor, id_patient, date);
      return res.status(201).json(appointment);
    } catch (error) {
      return res
        .status(500)
        .json(internalServerError);
    }
  }
);

// Get all patient appointments
PatientRouter.get(
  "/appointments",
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["patient"]),
  checkExistingPatient,
  query("page").isNumeric().withMessage("Page param must be an integer").optional(),
  query("limit").isNumeric().withMessage("Limit param must be an integer").optional(),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ ...badRequest, errors: errors.array() });
    }
    const { uid } = res.locals;
    const pagination: Pagination = { page: 1, limit: 10 };

    if (req.query.page) {
      pagination["page"] = +req.query.page;
    }

    if (req.query.limit) {
      pagination["limit"] = +req.query.limit;
    }

    try {
      const appointments = await getPatientAppointments(uid, pagination);
      return res.status(200).json(appointments);
    } catch (error) {
      return res
        .status(500)
        .json(internalServerError);
    }
  }
);

// Get single patient appointment
PatientRouter.get(
  "/appointments/:id",
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["patient"]),
  query("id").exists().isNumeric(),
  checkPatientAssociation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ ...badRequest, errors: errors.array() });
    }
    const { id } = req.params;
    try {
      const appointment = await getSinglePatientAppointment(+id);
      return res.status(200).json(appointment);
    } catch (error) {
      return res
        .status(500)
        .json(internalServerError);
    }
  }
);

// Delete an appointment
PatientRouter.delete(
  "/appointments/:id",
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["patient"]),
  param("id").exists().isNumeric(),
  checkPatientAssociation,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ ...badRequest, errors: errors.array() });
    }
    const { id } = req.params;
    try {
      await deletePatientAppointment(+id);
      return res
        .status(200)
        .json({ sucess: "Appointment deleted successfully!" });
    } catch (error) {
      return res
        .status(500)
        .json(internalServerError);
    }
  }
);
