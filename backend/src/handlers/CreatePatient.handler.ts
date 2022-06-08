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
    const firebaseUser = await firebaseAdmin.auth().createUser({
      displayName: `${first_name} ${last_name}`,
      // you can use just "email"
      email: email,
      // you can use just "password"
      password: password,
    });
    await firebaseAdmin.auth().setCustomUserClaims(firebaseUser.uid, { role });
    
    const userCreated = await Users.create({
      id: firebaseUser.uid,
      // you can use just "first_name"
      first_name: first_name,
      // you can use just "last_name"
      last_name: last_name,
      // you can use just "birthdate_name"
      birthdate: birthdate,
    });

    await Patients.create({
      id_user: userCreated.id,
      // you can use just "curp"
      curp: curp,
    });
    console.log(`New patient created! ID: ${firebaseUser.uid} / Email: ${firebaseUser.email}`)
    return ({success: "Patient created succesfully!"}); // Please return the ID that your front is going to use
  } catch (error) {
    return error;
  }
};
