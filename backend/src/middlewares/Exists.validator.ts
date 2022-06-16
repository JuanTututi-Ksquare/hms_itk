import { NextFunction, Request, Response } from "express";
import { internalServerError, unauthorized } from "../config/CustomRespones";
import { Appointments } from "../models/Appointments.model";
import { Doctors } from "../models/Doctors.model";
import { Patients } from "../models/Patients.model";
import { Users } from "../models/Users.model";

export const checkExistingPatient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await Users.findOne({
      where: {
        id: res.locals.uid,
        is_deleted: false,
      },
    });
    if (user) {
      const patient = await Patients.findOne({
        where: {
          id_user: user.id,
        },
      });
      if (patient) {
        res.locals = { ...res.locals, id_patient: patient.id };
      }
      return next();
    } else {
      return res.status(400).json({ error: `Patient doesn't exists!` });
    }
  } catch (error) {
    return res.status(500).json(internalServerError);
  }
};

export const checkExistingDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let doctor: Doctors | Users | null;
  try {
    if (req.body.id_doctor) {
      const user = await Users.findOne({
        where: {
          id: req.body.id_doctor,
          is_deleted: false,
        },
      });
      if (user) {
        doctor = await Doctors.findOne({
          where: {
            id: req.body.id_doctor,
            availability: true,
          },
        });
        if (doctor) {
          res.locals = { ...res.locals, id_doctor: doctor.id };
        } else {
          return res.status(400).json({ error: `Doctor doesn't exists or is currently unavaliable!` });
        }
      }
    } else {
      doctor = await Users.findOne({
        where: {
          id: res.locals.uid,
          is_deleted: false,
        },
      });
      if (doctor) {
        return next();
      } else {
        return res.status(501).json(unauthorized);
      }
    }
  } catch (error) {
    return res.status(500).json(internalServerError);
  }
};

export const checkExistingAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const appointment = await Appointments.findOne({
      where: {
        date: req.body.date,
        status: true,
      },
    });
    if (appointment) {
      return res.status(400).json({ error: `Appointment already exists!` });
    } else {
      return next();
    }
  } catch (error) {
    return res
      .status(500)
      .json(internalServerError);
  }
};

export const checkInactiveUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id_user } = req.body;
    const inactiveUser = await Users.findOne({
      where: {
        id: id_user,
        is_deleted: true,
      },
    });
    if (inactiveUser) {
      return next();
    } else {
      return res.status(404).json({ error: `User is active or not existing` });
    }
  } catch (error) {
    return res
      .status(500)
      .json(internalServerError);
  }
};

export const checkExistingUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { uid } = res.locals;
    const activeUser = await Users.findOne({
      where: {
        id: uid,
        is_deleted: false,
      },
    });
    if (activeUser) {
      return next();
    } else {
      res.status(404).json({ error: `User is not active or not existing!` });
    }
  } catch (error) {
    return res
      .status(500)
      .json(internalServerError);
  }
};
