import { Request, Response } from "express";
import { TenantAwareAuth } from "firebase-admin/lib/auth/tenant-manager";
import { Appointments } from "../models/Appointments.model";
import { Doctors } from "../models/Doctors.model";
import { Patients } from "../models/Patients.model";
import { Users } from "../models/Users.model";

export const checkExistingPatient = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const patient = await Patients.findOne({
      where: {
        id_user: res.locals.uid,
      },
    });
    if (patient) {
      res.locals = { ...res.locals, id_patient: patient.id };
      return next();
    } else {
      return res
        .status(400)
        .send({error: `Patient doesn't exists!`});
    }
  } catch (error) {
    return res.status(500).send({error: "Internal server error, please try again later! :("});
  }
};

export const checkExistingDoctor = async (
  req: Request,
  res: Response,
  next: Function
) => {
  let doctor: Doctors | null;
  try {
    if (req.body.id_doctor) {
      doctor = await Doctors.findOne({
        where: {
          id: req.body.id_doctor,
        },
      });
    } else {
      doctor = await Doctors.findOne({
        where: {
          id_user: res.locals.uid,
        },
      });
    }

    if (!doctor) {
      return res
        .status(400)
        .send({error: `Doctor doesn't exists!`});
    } else {
      res.locals = { ...res.locals, id_doctor: doctor.id };
      return next();
    }
  } catch (error) {
    return res.status(500).send({error: "Internal server error, please try again later! :("});
  }
};

export const checkExistingAppointment = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const appointment = await Appointments.findOne({
      where: {
        date: req.body.date,
        status: true,
      },
    });
    if (appointment) {
      return res
        .status(400)
        .send({error: `Appointment already exists!`});
    } else {
      return next();
    }
  } catch (error) {
    return res.status(500).send({error: "Internal server error, please try again later! :("});
  }
};

export const checkInactiveUser = async (
  req: Request,
  res: Response,
  next: Function
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
      return res.status(404).send({error: `User doesn't exists!`});
    }
  } catch (error) {
    return res.status(500).send({error: "Internal server error, please try again later! :("});
  }
};

export const checkExistingUser = async (req: Request, res: Response, next: Function) => {
  try {
    const {uid} = res.locals;
    const activeUser = await Users.findOne({
      where: {
        id: uid,
        is_deleted: false
      }
    })
    if(activeUser) {
      return next();
    } else {
      res.status(404).send({error: `User doesn't exists!`})
    }
  } catch (error) {
    return res.status(500).send({error: "Internal server error, please try again later! :("});
  }
}