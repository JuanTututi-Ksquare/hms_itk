import { Op } from "sequelize";
import { Appointments } from "../models/Appointments.model";
import { Patients } from "../models/Patients.model";

// Admin
// Get all appointments
export const getAllAppointments = async () => {
  try {
    const appointments = await Appointments.findAll();
    return appointments;
  } catch (error) {
    return error;
  }
};

export const getAllAppointmentsByPatient = async (id_patient: number) => {
  try {
    const appointments = await Appointments.findAll({
      where: {
        id_patient: id_patient,
      }
    })
    if(appointments.length) {
      return appointments
    } else {
      return ({info: "No results were found!"})
    }
  } catch (error) {
    return error;
  }
}

export const getAllAppointmentsByDoctor = async (id_doctor: number) => {
  try {
    const appointments = await Appointments.findAll({
      where: {
        id_doctor: id_doctor,
      }
    })
    if(appointments.length) {
      return appointments
    } else {
      return ({info: "No results were found!"})
    }
  } catch (error) {
    return error;
  }
}

// Patient
export const getPatientAppointments = async (uid: number) => {
  try {
    const patient = await Patients.findOne({
      where: {
        id_user: uid,
      },
    });
    if(!patient) {
      throw new Error(`User with id: ${uid} doesn't exists!`)
    }
    const list = await Appointments.findAll({
      where: {
        id_patient: patient.id,
        status: true,
      },
    });
    if (!list.length) {
      return ({info: "No results were found!"})
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
       return ({info: "No results were found!"})
    }
  } catch (error) {
    return error;
  }
}

// Doctor
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
      return ({info: "No results were found!"})
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
      return ({info: "No results were found!"})
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
      return ({info: "This doctor doesn't have any appointments yet"})
    }
  } catch (error) {
    return ({error: error});
  }
}