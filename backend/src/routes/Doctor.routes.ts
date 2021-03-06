import { Request, Response, Router } from "express";
import { body, param, validationResult } from "express-validator";
import { badRequest, internalServerError } from "../config/CustomRespones";
import { DoctorFilters, Pagination } from "../config/CustomTypes";
import { getDoctorAppointments } from "../handlers/GetAppointments.handler";
import { UpdateAppointmentDate } from "../handlers/UpdateAppointment.handler";
import { checkAuth } from "../middlewares/Auth.validator";
import {
  checkExistingAppointment,
  checkExistingDoctor,
} from "../middlewares/Exists.validator";
import { IsDeleted } from "../middlewares/IsDeleted.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const DoctorsRouter = Router();

DoctorsRouter.get(
  "/appointments",
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["doctor"]),
  checkExistingDoctor,
  async (req: Request, res: Response) => {
    const { id_doctor } = res.locals;
    let filters: DoctorFilters = {};
    let pagination: Pagination = { page: 1, limit: 5 };

    // Get appointments for specific date - can be ordered
    if (req.query.date && typeof req.query.date === "string") {
      const splittedDate = req.query.date.split("+");
      if (splittedDate[1] === "DESC") {
        filters["dateOrder"] = "DESC";
      }
      if (splittedDate[1] === "ASC") {
        filters["dateOrder"] = "ASC";
      }
      const date = splittedDate[0];
      const checkDate = new Date(date);
      if (checkDate) {
        filters["date"] = date;
      } else {
        res.status(400).send({ error: "Invalid request!" });
      }
    }

    // Get appointments for specific index and ordered
    if (req.query.order && typeof req.query.order === "string") {
      const splittedOrder = req.query.order.split("+");
      const index = splittedOrder[0];
      const order = splittedOrder[1];
      if (index === "patient" && order === "ASC") {
        filters["orderByPatient"] = order;
      } else if (index === "patient" && order === "DESC") {
        filters["orderByPatient"] = order;
      } else if (index === "patient") {
        filters["orderByPatient"] = "ASC";
      }

      if (index === "date" && order === "ASC") {
        filters["orderByDate"] = order;
      } else if (index === "date" && order === "DESC") {
        filters["orderByDate"] = order;
      } else if (index === "date") {
        filters["orderByDate"] = "ASC";
      }
    }

    if (req.query.patient && typeof req.query.patient === "string") {
      const id_patient = +req.query.patient;
      if (!Number.isNaN(id_patient)) {
        filters = { ...filters, id_patient: id_patient };
      } else {
        return res.status(400).send({ error: "Invalid request!" });
      }
    }

    if (req.query.page && typeof req.query.page === "string") {
      const page = +req.query.page;
      if (!Number.isNaN(page)) {
        pagination["page"] = page;
      } else {
        return res.status(400).send({ error: "Invalid request!" });
      }
    }

    if (req.query.limit && typeof req.query.limit === "string") {
      const limit = +req.query.limit;
      if (!Number.isNaN(limit)) {
        pagination["limit"] = limit;
      } else {
        return res.status(400).send({ error: "Invalid request!" });
      }
    }

    try {
      if (Object.keys(filters).length) {
        const appointments = await getDoctorAppointments(
          id_doctor,
          pagination,
          filters
        );
        return res.status(200).send(appointments);
      } else {
        if (
          !Object.keys(req.query).length ||
          Object.keys(req.query).includes("page") ||
          Object.keys(req.query).includes("limit")
        ) {
          const appointments = await getDoctorAppointments(
            id_doctor,
            pagination
          );
          return res.status(200).send(appointments);
        } else {
          return res.status(400).send({ error: "Invalid request!" });
        }
      }
    } catch (error) {
      return res
        .status(500)
        .send({ error: "Internal server error, please try again later!" });
    }
  }
);

DoctorsRouter.patch(
  "/appointments/:id",
  body("date")
    .exists()
    .withMessage("Date is missing")
    .toDate()
    .withMessage("Date is not a valid date")
    .isAfter()
    .withMessage("Date must be in the future"),
  param("id")
    .exists()
    .withMessage("ID is missing")
    .isNumeric()
    .withMessage("ID must be a number"),
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["doctor"]),
  checkExistingDoctor,
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ ...badRequest, errors: errors.array() });
    }
    const { date } = req.body;
    const { id } = req.params;
    try {
      const appointment = await UpdateAppointmentDate(date, +id);
      return res.status(200).send(appointment);
    } catch (error) {
      return res
        .status(500)
        .send(internalServerError);
    }
  }
);