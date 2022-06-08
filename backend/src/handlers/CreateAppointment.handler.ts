import { Appointments } from "../models/Appointments.model"

export const CreateAppointment = async (id_doctor:number, id_patient:number , date: Date) => {
    try {
        const createdAppointment = await Appointments.create({
            // you can use just "id_doctor"
            id_doctor: id_doctor,
            // you can use just "id_patient"
            id_patient: id_patient,
            // you can use just "date"
            date: date,
        });
        return ({success: createdAppointment}); // Please return the ID that your front is going to use
    } catch (error) {
        return error;
    }
}