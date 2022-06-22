import { Appointments } from "../models/Appointments.model";

export const CreateAppointment = async (
  id_doctor: number,
  id_patient: number,
  date: Date
) => {
  try {
    const createdAppointment = await Appointments.create({
      id_doctor,
      id_patient,
      date,
    });
    return { success: "Appointment created successfully", id: createdAppointment.id, date, id_doctor, id_patient };
  } catch (error) {
    return error;
  }
};
