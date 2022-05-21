import { Request, Response } from "express";
import { Appointments } from "../models/Appointments.model";
import { Doctors } from "../models/Doctors.model";
import { Patients } from "../models/Patients.model";

export const checkExistingPatient = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const patient = await Patients.findOne({
    where: {
      id_user: res.locals.uid,
    },
  });
  if (!patient) {
    return res
      .status(400)
      .send(`Patient with id:${res.locals.uid} doesn't exists!`);
  } else {
    return next();
  }
};

export const checkExistingDoctor = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const doctor = await Doctors.findOne({
    where: {
      id: req.body.id_doctor,
    },
  });
  if (!doctor) {
    return res
      .status(400)
      .send(`Doctor with id:${req.body.id_doctor} doesn't exists!`);
  } else {
      return next();
  }
};

export const checkExistingAppointment = async (
    req: Request,
    res: Response,
    next: Function
  ) => {
    const appointment = await Appointments.findOne({
      where: {
        date: req.body.date,
      },
    });
    if (appointment) {
      return res
        .status(400)
        .send(`Appointment with date:${req.body.date} already exists!`);
    } else {
        return next();
    }
  };
