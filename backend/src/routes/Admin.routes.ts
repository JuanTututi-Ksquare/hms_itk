import { Router, Request, Response } from "express";
import { body, query, validationResult } from "express-validator";
import { badRequest, internalServerError } from "../config/CustomRespones";
import { AdminFilters, UserFilters } from "../config/CustomTypes";
import { ActivateUser } from "../handlers/ActivateUser.handler";
import { CreateAdmin } from "../handlers/CreateAdmin.handler";
import { CreateDoctor } from "../handlers/CreateDoctor.handler";
import { GetAllUsers } from "../handlers/GetAllUsers.handler";
import { getAllAppointments } from "../handlers/GetAppointments.handler";
import { checkAuth } from "../middlewares/Auth.validator";
import { checkInactiveUser } from "../middlewares/Exists.validator";
import { IsDeleted } from "../middlewares/IsDeleted.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const AdminRouter = Router();

// Create admin
AdminRouter.post(
  "/",
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator([]),
  body("first_name")
    .exists()
    .withMessage("First name is missing from request body")
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 chars long"),
  body("last_name")
    .exists()
    .withMessage("Last name is missing from request body")
    .isLength({ min: 2 })
    .withMessage("Last name must be at least 2 chars long"),
  body("birthdate")
    .exists()
    .withMessage("Birthdate is missing from request body")
    .isDate()
    .withMessage("Birthdate must be a valid date")
    .isBefore()
    .withMessage("Birthdate must be at least 18 years ago"),
  body("email")
    .exists()
    .withMessage("Email is missing from request body")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  body("password")
    .exists()
    .withMessage("Password is missing from request body")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 chars long"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ ...badRequest, errors: errors.array() });
    }
    const { first_name, last_name, birthdate, email, password } = req.body;
    try {
      return res.send(
        await CreateAdmin(first_name, last_name, birthdate, email, password)
      );
    } catch (error) {
      return res.status(500).send(internalServerError);
    }
  }
);

// Create a Doctor
AdminRouter.post(
  "/doctors",
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["admin"]),
  //   First and last name must be at least 2 chars long
  body("first_name")
    .exists()
    .withMessage("First name is missing from request body")
    .isLength({ min: 2 })
    .withMessage("First name must contain at least 2 chars"),
  body("last_name")
    .exists()
    .withMessage("Last name is missing from request body")
    .isLength({ min: 2 })
    .withMessage("Last name must contain at least 2 chars"),
  //   Birthdate must be before current date
  body("birthdate")
    .exists()
    .withMessage("Birthdate is missing from request body")
    .isDate()
    .withMessage("Birthdate must be a valid date")
    .isBefore()
    .withMessage("Birthdate must be a past date"),
  //   Email has to be on correct format
  body("email")
    .exists()
    .withMessage("Email is missing from request body")
    .isEmail()
    .withMessage("Email must be a valid email address"),
  //   Password must be at least 6 chars
  body("password")
    .exists()
    .withMessage("Password is missing from request body")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 chars long"),
  body("license")
    .exists()
    .withMessage("License is missing from request body")
    .isLength({ min: 10, max: 10 })
    .withMessage("License must be at least 10 chars long"),
  body("id_area")
    .exists()
    .withMessage("Area is missing from request body")
    .isInt({ min: 1, max: 9 })
    .withMessage("Area must be a valid hospital area"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ ...badRequest, errors: errors.array() });
    }
    const {
      first_name,
      last_name,
      birthdate,
      email,
      password,
      license,
      id_area,
    } = req.body;
    try {
      res.send(
        await CreateDoctor(
          first_name,
          last_name,
          birthdate,
          license,
          id_area,
          email,
          password
        )
      );
    } catch (error) {
      return res.status(500).send(internalServerError);
    }
  }
);

// Activate User
AdminRouter.patch(
  "/users",
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["admin"]),
  body("id_user").exists().isNumeric(),
  checkInactiveUser,
  async (req: Request, res: Response) => {
    const { id_user } = req.body;
    try {
      await ActivateUser(id_user);
      res.status(200).send({ success: "User activated successfully!" });
    } catch (error) {
      res.status(500).send(internalServerError);
    }
  }
);

// Get appointments
AdminRouter.get(
  "/appointments",
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["admin"]),
  async (req: Request, res: Response) => {
    let filters: AdminFilters = {};
    let pagination: { page: number; limit: number } = { page: 1, limit: 10 };
    // Filter by patient
    if (req.query.patient && typeof req.query.patient === "string") {
      const id_patient = req.query.patient;
      if (!Number.isNaN(parseInt(id_patient, 10))) {
        filters = { ...filters, id_patient: +id_patient };
      } else {
        res.status(400).send({ ...badRequest, error: "Invalid url query - patient search!" });
      }
    }

    // Filter by doctor
    if (req.query.doctor && typeof req.query.doctor === "string") {
      const id_doctor = req.query.doctor;
      if (!Number.isNaN(parseInt(id_doctor, 10))) {
        filters = { ...filters, id_doctor: +id_doctor };
      } else {
        res.status(400).send({ ...badRequest, error: "Invalid url query - doctor search!" });
      }
    }

    // Filter by status
    if (req.query.status && typeof req.query.status === "string") {
      let status = true;
      if (req.query.status === "true") {
        status = true;
        filters = { ...filters, status };
      } else if (req.query.status === "false") {
        status = false;
        filters = { ...filters, status };
      } else {
        res.status(400).send({ ...badRequest, error: "Invalid url query - status order!" });
      }
    }

    if (req.query.order && typeof req.query.order === "string") {
      const splittedOrder = req.query.order.split("+");
      const index = splittedOrder[0];
      const order = splittedOrder[1];
      // Order by Patient ID
      if (index === "patient" && order === "ASC") {
        filters["orderByPatient"] = "ASC";
      } else if (index === "patient" && order === "DESC") {
        filters["orderByPatient"] = "DESC";
      } else if (index === "patient") {
        filters["orderByPatient"] = "ASC";
      }

      // Order by Doctor ID
      if (index === "doctor" && order === "ASC") {
        filters["orderByDoctor"] = "ASC";
      } else if (index === "doctor" && order === "DESC") {
        filters["orderByDoctor"] = "DESC";
      } else if (index === "doctor") {
        filters["orderByDoctor"] = "ASC";
      }
    }

    if (typeof req.query.page === "string") {
      const page = req.query.page;
      if (!Number.isNaN(parseInt(page, 10))) {
        pagination["page"] = +page;
      } else {
        res.status(400).send({ ...badRequest, error: "Invalid url query!" });
      }
    }

    if (typeof req.query.limit === "string") {
      const limit = req.query.limit;
      if (!Number.isNaN(parseInt(limit, 10))) {
        pagination["limit"] = +limit;
      } else {
        res.status(400).send({ ...badRequest, error: "Invalid url query!" });
      }
    }
    try {
      if (Object.keys(filters).length) {
        const appointments = await getAllAppointments(pagination, filters);
        res.status(200).send(appointments);
      } else {
        if (
          !Object.keys(req.query).length ||
          Object.keys(req.query).includes("page") ||
          Object.keys(req.query).includes("limit")
        ) {
          console.log("sin filters 1");
          const appointments = await getAllAppointments(pagination);
          res.status(200).send(appointments);
        } else {
          res.status(400).send({ ...badRequest, error: "Invalid url query - no queries!" });
        }
      }
    } catch (error) {
      res.status(500).send(internalServerError);
    }
  }
);

AdminRouter.get(
  "/users",
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["admin"]),
  async (req: Request, res: Response) => {
    let filters: UserFilters = {};
    let pagination: { page: number; limit: number } = { page: 1, limit: 10 };
    if (req.query.is_deleted && typeof req.query.is_deleted === "string") {
      let is_deleted = false;
      if (req.query.status === "true") {
        is_deleted = true;
        filters = { ...filters, is_deleted };
      } else if (req.query.status === "false") {
        is_deleted = false;
        filters = { ...filters, is_deleted };
      } else {
        return res.status(400).send({ ...badRequest, error: "Invalid url query!" });
      }
    }
    try {
      const users = await GetAllUsers(filters, pagination);
      return res.status(200).json(users);  
    } catch (error) {
      return res.status(500).send(internalServerError);
    }
  }
);
