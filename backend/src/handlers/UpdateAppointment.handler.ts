import { Appointments } from "../models/Appointments.model";

export const UpdateAppointmentDate = async (date: Date, id: number) => {
  try {
    const updatedAppointment = await Appointments.update( // unused variable created
      {
        // only date
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
