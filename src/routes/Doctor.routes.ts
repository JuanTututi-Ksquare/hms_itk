import { Request, Response, Router } from "express";
import { body, param } from "express-validator";
import { DoctorFilters, Pagination } from "../config/CustomTypes";
import { getDoctorAppointments } from "../handlers/GetAppointments.handler";
import { UpdateAppointmentDate } from "../handlers/UpdateAppointment.handler";
import { checkDoctorAssociation } from "../middlewares/Association.validator";
import { checkAuth } from "../middlewares/Auth.validator";
import {
  checkExistingAppointment,
  checkExistingDoctor,
} from "../middlewares/Exists.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const DoctorsRouter = Router();

DoctorsRouter.get(
  "/appointments",
  checkAuth,
  roleValidator(["doctor"]),
  checkExistingDoctor,
  async (req: Request, res: Response) => {
    const { id_doctor } = res.locals;
    let filters: DoctorFilters = {};
    let pagination: Pagination = { page: 1, limit: 10 };

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
    if(req.query.order && typeof req.query.order === "string") {
      const splittedOrder = req.query.order.split("+");
      const index = splittedOrder[0];
      const order = splittedOrder[1];
      if (index === "patient" && order === "ASC") {
        filters["orderByPatient"] = order;
      } else if (index === "patient" && order === "DESC") {
        filters["orderByPatient"] = order
      } else if (index ==="patient") {
        filters["orderByPatient"] = "ASC";
      }

      if (index === "date" && order === "ASC") {
        filters["orderByDate"] = order
      } else if(index === "date" && order === "DESC") {
        filters["orderByDate"] = order
      } else if (index === "date") {
        filters["orderByDate"] = "ASC"
      }
    }

    if (req.query.patient && typeof req.query.patient === "string") {
      const id_patient = +req.query.patient;
      if (!Number.isNaN(id_patient)) {
        filters = { ...filters, id_patient: id_patient };
      } else {
        res.status(400).send({ error: "Invalid request!" });
      }
    }

    if (req.query.page && typeof req.query.page === "string") {
      const page = +req.query.page;
      if (!Number.isNaN(page)) {
        pagination["page"] = page;
      } else {
        res.status(400).send({ error: "Invalid request!" });
      }
    }

    if (req.query.limit && typeof req.query.limit === "string") {
      const limit = +req.query.limit;
      if (!Number.isNaN(limit)) {
        pagination["limit"] = limit;
      } else {
        res.status(400).send({ error: "Invalid request!" });
      }
    }

    try {
      if (Object.keys(filters).length) {
        const appointments = await getDoctorAppointments(
          id_doctor,
          pagination,
          filters
        );
        res.status(200).send(appointments);
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
          res.status(200).send(appointments);
        } else {
          res.status(400).send({ error: "Invalid request!" });
        }
      }
    } catch (error) {
      res
        .status(500)
        .send({ error: "Internal server error, please try again later!" });
    }
  }
);

DoctorsRouter.patch(
  "/appointments/:id",
  body("date").exists().isDate().isAfter(),
  param("id").exists().isNumeric(),
  checkAuth,
  roleValidator(["doctor"]),
  checkExistingDoctor,
  checkExistingAppointment,
  checkDoctorAssociation,
  async (req: Request, res: Response) => {
    const { date } = req.body;
    const { id } = req.params;
    try {
      const appointment = await UpdateAppointmentDate(date, +id);
      res.status(200).send(appointment);
    } catch (error) {
      res
        .status(500)
        .send({ error: "Internal server error, please try again later!" });
    }
  }
);
