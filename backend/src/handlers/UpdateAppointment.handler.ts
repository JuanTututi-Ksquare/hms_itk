import { Appointments } from "../models/Appointments.model";

export const UpdateAppointmentDate = async (date: Date, id: number) => {
  try {
    const updatedAppointment = await Appointments.update(
      {
        date: date,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (updatedAppointment) {
      return { success: "Appointment updated sucessfully!", date};
    } else {
      throw new Error("Appointment with given id doesn't exists");
    }
  } catch (error) {
    return error;
  }
};
