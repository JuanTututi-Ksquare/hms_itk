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
      return {info: "This user doesn't have any appointments yet"}
    } else {
      return list;
    }
  } catch (error) {
    return error;
  }
};

export const getSinglePatientAppointment = async (id_appointment: number) => {
  try {
    const appointment = Appointments.findOne({
      where: {
        id: id_appointment
      }
    })
    return appointment;
  } catch (error) {
    return error;
  }
}