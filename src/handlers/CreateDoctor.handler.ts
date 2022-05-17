import { Users } from "../models/Users.model";
import { Doctors } from "../models/Doctors.model";

export const CreateDoctor = async(
  first_name: string,
  last_name: string,
  birthdate: Date,
  email: string,
  password: string,
  license: string,
  id_area: number,
) => {
    try {
        const userCreated = await Users.create({
            id_role: 2,
            first_name: first_name,
            last_name: last_name,
            birthdate: birthdate,
            email: email,
            password: password
        });
        await Doctors.create({
            id_user: userCreated.id,
            license: license,
            id_area: id_area
        })
        return "Doctor registration was succesful!";
    } catch (error) {
        return error;
    }
};