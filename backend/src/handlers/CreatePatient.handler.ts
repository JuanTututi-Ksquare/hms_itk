import { Users } from "../models/Users.model";
import { Patients } from "../models/Patients.model";
import { createFirebaseUser } from "./CreateFirebaseUser.handler";

export const CreatePatient = async (
  first_name: string,
  last_name: string,
  birthdate: Date,
  email: string,
  password: string,
  curp: string,
) => {
  try {
    const role = "patient";
    const firebaseUser = await createFirebaseUser({first_name, last_name, email, password, role});
    
    const userCreated = await Users.create({
      id: firebaseUser.uid,
      first_name: first_name,
      last_name: last_name,
      birthdate: birthdate,
    });

    await Patients.create({
      id_user: userCreated.id,
      curp: curp,
    });
    console.log(`New patient created! ID: ${firebaseUser.uid} / Email: ${firebaseUser.email}`)
    return ({success: "Patient created succesfully!", id: firebaseUser.uid});
  } catch (error) {
    return error;
  }
};
