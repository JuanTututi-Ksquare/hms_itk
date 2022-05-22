import { Appointments } from "../models/Appointments.model";

export const deletePatientAppointment = async (id_appointment: number) => {
    try {
      Appointments.update({
        status: false
      }, {
        where: {
          id: id_appointment
        }
      })
      return {succesful: "Appointment was deleted!"}
    } catch (error) {
      return error;
    }
  }