import { Users } from "../models/Users.model";
import { Doctors } from "../models/Doctors.model";
import * as firebaseAdmin from "firebase-admin";
import { Role } from "../config/CustomTypes";

export const CreateDoctor = async (
  first_name: string,
  last_name: string,
  birthdate: Date,
  license: string,
  id_area: number,
  email: string,
  password: string,
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
    console.log(firebaseUser);
    if(!firebaseUser.email){
      throw new Error("Something went wrong! :(");
    }
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
    await Doctors.create({
      id_user: userCreated.id,
      // you can use just "license"
      license: license,
      // you can use just "id_area"
      id_area: id_area
    });
    console.log(`New doctor created! ID: ${firebaseUser.uid} / Email: ${firebaseUser.email}`)
    return ({success: "Doctor created succesfully!"}); // Please return the ID that your front is going to use
  } catch (error) {
    return error;
  }
};
