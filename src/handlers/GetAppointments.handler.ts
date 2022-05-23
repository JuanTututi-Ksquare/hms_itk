import { Op } from "sequelize";
import { Appointments } from "../models/Appointments.model";
import { Patients } from "../models/Patients.model";

export const getAllAppointments = async () => {
  try {
    const appointments = await Appointments.findAll();
    return appointments;
  } catch (error) {
    return error;
  }
};

export const getPatientAppointments = async (uid: number) => {
  try {
    const patient = await Patients.findOne({
      where: {
        id_user: uid,
      },
    });
    if(!patient) {
      return {error: "Ups... something went wrong! :("}
    }
    const list = await Appointments.findAll({
      where: {
        id_patient: patient.id,
        status: true,
      },
    });
    if (!list) {
      return {info: "This patient doesn't have any appointments yet"}
    } else {
      return list;
    }
  } catch (error) {
    return error;
  }
};

export const getSinglePatientAppointment = async (id_appointment: number) => {
  try {
    const appointment = await Appointments.findOne({
      where: {
        id: id_appointment,
        status: true
      }
    })
    if (appointment) {
      return appointment; 
    } else {
       return ({error: "No results were found!"})
    }
    
  } catch (error) {
    return error;
  }
}

export const getDoctorAppointments = async (id_doctor: number) => {
  try {
    const appointments = await Appointments.findAll({
      where: {
        id_doctor: id_doctor,
        status: true,
      }
    });
    if (appointments.length) {
      return appointments;
    } else {
      return ({error: "This doctor doesn't have any appointments yet"})
    }
  } catch (error) {
    return error
  }
}

export const getDoctorAppointmentsByDate = async (id_doctor: number, date: string) => {
  try {
    const initialDate = date + "T00:00:00";
    const endDate = date + "T24:00:00";
    const appointments = await Appointments.findAll({
      where: {
        id_doctor: id_doctor,
        date: {[Op.between]: [initialDate, endDate]},
        status: true,
      }
    });
    if (appointments.length) {
      return appointments;
    } else {
      return ({error: "This doctor doesn't have any appointments yet"})
    }
  } catch (error) {
    return error
  }
}

export const getDoctorAppointmentsByPatient = async (id_doctor: number, id_patient: number) => {
  try {
    const appointments = await Appointments.findAll({
      where: {
        id_doctor: id_doctor,
        id_patient: id_patient,
        status: true
      }
    });
    if (appointments.length) {
      return appointments;
    } else {
      return ({error: "No results were found!"})
    }
  } catch (error) {
    return ({error: error});
  }
}