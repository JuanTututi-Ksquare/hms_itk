import { Users } from "../models/Users.model";
import { Patients } from "../models/Patients.model";

export const CreatePatient = async(
  first_name: string,
  last_name: string,
  birthdate: Date,
  email: string,
  password: string,
  curp: string
) => {
    try {
        const userCreated = await Users.create({
            id_role: 1,
            first_name: first_name,
            last_name: last_name,
            birthdate: birthdate,
            email: email,
            password: password
        });
        await Patients.create({
            id_user: userCreated.id,
            curp: curp,
        })
        return "Patient registration was succesful!";
    } catch (error) {
        return error;
    }
};
