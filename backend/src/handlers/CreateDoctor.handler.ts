import { Users } from "../models/Users.model";
import { Doctors } from "../models/Doctors.model";
import { Role } from "../config/CustomTypes";
import { createFirebaseUser } from "./CreateFirebaseUser.handler";

export const CreateDoctor = async (
  first_name: string,
  last_name: string,
  birthdate: Date,
  license: string,
  id_area: number,
  email: string,
  password: string
) => {
  try {
    const role: Role = "doctor";
    const firebaseUser = await createFirebaseUser({first_name, last_name, email, password, role});
    const userCreated = await Users.create({
      id: firebaseUser.uid,
      first_name,
      last_name,
      birthdate,
    });
    await Doctors.create({
      id_user: userCreated.id,
      license,
      id_area
    });
    console.log(`New doctor created! ID: ${firebaseUser.uid} / Email: ${firebaseUser.email}`)
    return ({success: "Doctor created successfully!", id: firebaseUser.uid});
  } catch (error) {
    return error;
  }
};
