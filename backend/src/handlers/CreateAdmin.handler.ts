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
    // Try to refactor the creation of the user record in firebase, since is shared by the admin, doctor and patient
    firebaseUser = await firebaseAdmin.auth().createUser({
      displayName: `${first_name} ${last_name}`,
      // you can use just "email"
      email: email,
      // you can use just "password"
      password: password,
    });
    await firebaseAdmin.auth().setCustomUserClaims(firebaseUser.uid, { role });
  } catch (error) {
    return error;
  }
  try {
    const userCreated = await Users.create({
      id: firebaseUser.uid,
      // you can use just "first_name"
      first_name: first_name,
      // you can use just "last_name"
      last_name: last_name,
      // you can use just "birthdate_name"
      birthdate: birthdate,
    });
    await Admins.create({
      id_user: userCreated.id,
    });
    console.log(`New admin created! ID: ${firebaseUser.uid} / Email: ${firebaseUser.email}`)
    return ({success: "Admin created succesfully!"}); // Please return the ID that your front is going to use
  } catch (error) {
      return error;
  }
};
