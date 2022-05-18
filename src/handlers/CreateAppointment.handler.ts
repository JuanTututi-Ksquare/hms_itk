import { Appointments } from "../models/Appointments.model"

export const CreateAppointment = async (id_doctor:number, id_patient:number , date: Date) => {
    try {
        const createdAppointment = await Appointments.create({
            id_doctor: id_doctor,
            id_patient: id_patient,
            date: date,
        });
        return "Appointment created succesfully!";
    } catch (error) {
        return error;
    }
}