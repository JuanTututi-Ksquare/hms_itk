import { Appointments } from "../models/Appointments.model";

export const UpdateAppointmentDate = async (date: Date, id: number) => {
  try {
    await Appointments.update(
      {
        date: date,
      },
      {
        where: {
          id: id,
        },
      }
    );
    return { success: "Appointment updated sucessfully!" };
  } catch (error) {
    return error;
  }
};
