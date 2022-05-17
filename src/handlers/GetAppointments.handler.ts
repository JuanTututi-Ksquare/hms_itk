import { Appointments } from "../models/Appointments.model";

export const GetAppointments = async () => {
  try {
    const appointments = await Appointments.findAll();
    return appointments;
  } catch (error) {
    return error;
  }
};
