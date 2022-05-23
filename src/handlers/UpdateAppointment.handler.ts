import { Appointments } from "../models/Appointments.model";

export const UpdateAppointment = async (date: Date, id: number) => {
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
    return { updatedAppointment: updatedAppointment };
  } catch (error) {
    return error;
  }
};
