import { Users } from "../models/Users.model";
import { Patients } from "../models/Patients.model";
import * as firebaseAdmin from "firebase-admin";
import { Role } from "../config/CustomTypes";

export const CreatePatient = async (
  first_name: string,
  last_name: string,
  birthdate: Date,
  email: string,
  password: string,
  curp: string,
  role: Role
) => {
  try {
    const { uid } = await firebaseAdmin.auth().createUser({
      displayName: `${first_name} ${last_name}`,
      email: email,
      password: password,
    });
    await firebaseAdmin.auth().setCustomUserClaims(uid, { role });
    
    const userCreated = await Users.create({
      id: uid,
      first_name: first_name,
      last_name: last_name,
      birthdate: birthdate,
    });

    await Patients.create({
      id_user: userCreated.id,
      curp: curp,
    });
    return "Patient registration was succesful!";
  } catch (error) {
    return error;
  }
};
