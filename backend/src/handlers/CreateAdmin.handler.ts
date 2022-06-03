import { Role } from "../config/CustomTypes";
import * as firebaseAdmin from "firebase-admin";
import { Users } from "../models/Users.model";
import { Admins } from "../models/Admins.model";

export const CreateAdmin = async (
  first_name: string,
  last_name: string,
  birthdate: Date,
  email: string,
  password: string,
  role: Role
) => {
  let firebaseUser;
  try {
    firebaseUser = await firebaseAdmin.auth().createUser({
      displayName: `${first_name} ${last_name}`,
      email: email,
      password: password,
    });
    await firebaseAdmin.auth().setCustomUserClaims(firebaseUser.uid, { role });
  } catch (error) {
    return error;
  }
  try {
    const userCreated = await Users.create({
      id: firebaseUser.uid,
      first_name: first_name,
      last_name: last_name,
      birthdate: birthdate,
    });
    await Admins.create({
      id_user: userCreated.id,
    });
    console.log(`New admin created! ID: ${firebaseUser.uid} / Email: ${firebaseUser.email}`)
    return ({success: "Admin created succesfully!"});
  } catch (error) {
      return error;
  }
};
