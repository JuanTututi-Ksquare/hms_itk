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
  if (patient) {
    res.locals = {...res.locals, id_patient: patient.id}
    return next();
  } else {
    return res
        .status(400)
        .send(`Patient with id:${res.locals.uid} doesn't exists!`); 
  }
};

export const checkExistingDoctor = async (
  req: Request,
  res: Response,
  next: Function
) => {
  let doctor: Doctors | null;
  if (req.body.id_doctor) {
    doctor = await Doctors.findOne({
      where: {
        id: req.body.id_doctor,
      },
    });
    console.log(req.body.id_doctor)
  } else {
    doctor = await Doctors.findOne({
      where: {
        id_user: res.locals.uid,
      }
    })
  }
  
  if (!doctor) {
    return res
      .status(400)
      .send(`Doctor with id:${req.body.id_doctor} doesn't exists!`);
  } else {
      res.locals = {...res.locals, id_doctor: doctor.id}
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
        status: true
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
