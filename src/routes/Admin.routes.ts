import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { AdminFilters } from "../config/CustomTypes";
import { ActivateUser } from "../handlers/ActivateUser.handler";
import { CreateAdmin } from "../handlers/CreateAdmin.handler";
import { CreateDoctor } from "../handlers/CreateDoctor.handler";
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
  body("first_name").exists().isLength({ min: 2 }),
  body("last_name").exists().isLength({ min: 2 }),
  body("birthdate").exists().isDate().isBefore(),
  body("email").exists().isEmail(),
  body("password").exists().isLength({ min: 6 }),
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
      role,
    } = req.body;
    if (role !== "admin") {
      return res.status(400).send({error: "Invalid request: Invalid role!"});
    }
    try {
      res.send(await CreateAdmin(first_name, last_name, birthdate, email, password, role))
    } catch (error) {
      res.status(500).send({error: "Internal server error, please try again later!"})
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
      return res.status(400).send({error: "Invalid request: Invalid role!"});
    }
    try {
      res.send(await CreateDoctor(
        first_name,
        last_name,
        birthdate,
        license,
        id_area,
        email,
        password,
        role
      ));
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
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["admin"]),
  body("id_user").exists().isNumeric(),
  checkInactiveUser,
  async (req: Request, res: Response) => {
    const { id_user } = req.body;
    try {
      await ActivateUser(id_user);
      res.status(200).send({success: "User activated successfully!"});
    } catch (error) {
      res
        .status(500)
        .send({ error: "Internal server error, please try again later!" });
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
      const id_patient = +req.query.patient;
      if (!Number.isNaN(id_patient)) {
        filters = { ...filters, id_patient: +id_patient };
      } else {
        res.status(400).send({error: "Invalid request!"});
      }
    }

    // Filter by doctor
    if (req.query.doctor && typeof req.query.doctor === "string") {
      const id_doctor = +req.query.doctor;
      if (!Number.isNaN(id_doctor)) {
        filters = { ...filters, id_doctor: +id_doctor };
      } else {
        res.status(400).send({error: "Invalid request!"});
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
        res.status(400).send({error: "Invalid request!"});
      }
    }

    if(req.query.order && typeof req.query.order === "string") {
      const splittedOrder = req.query.order.split("+");
      const index = splittedOrder[0];
      const order = splittedOrder[1];
      // Order by Patient ID
      if (index === "patient" && order === "ASC") {
        filters["orderByPatient"] = "ASC";
      } else if (index === "patient" && order === "DESC") {
        filters["orderByPatient"] = "DESC";
      } else if(index === "patient") {
        filters["orderByPatient"] = "ASC"
      }

      // Order by Doctor ID
      if (index === "doctor" && order === "ASC") {
        filters["orderByDoctor"] = "ASC";
      } else if (index === "doctor" && order === "DESC") {
        filters["orderByDoctor"] = "DESC";
      } else if(index === "doctor") {
        filters["orderByDoctor"] = "ASC"
      }

    }

    if (typeof req.query.page === "string") {
      const page = +req.query.page;
      if (typeof page === "number") {
        pagination["page"] = +req.query.page;
      } else {
        res.status(400).send({error: "Invalid request!"});
      }
    }

    if (typeof req.query.limit === "string") {
      const limit = +req.query.limit;
      if (typeof limit === "number") {
        pagination["limit"] = +req.query.limit;
      } else {
        res.status(400).send({error: "Invalid request!"});
      }
    }
    try {
      if (Object.keys(filters).length) {
        const appointments = await getAllAppointments(pagination, filters);
        res.status(200).send(appointments);
      } else {
        if (!Object.keys(req.query).length ||
        Object.keys(req.query).includes("page") ||
        Object.keys(req.query).includes("limit") ) {
          console.log("sin filters 1");
          const appointments = await getAllAppointments(pagination);
          res.status(200).send(appointments);
        } else {
          res.status(400).send({error: "Invalid request!"});
        }
      }
    } catch (error) {
      res
        .status(500)
        .send({ error: "Internal server error, please try again later!" });
    }
  }
);