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
      email: email,
      password: password,
    });
    await firebaseAdmin.auth().setCustomUserClaims(firebaseUser.uid, { role });
    
    const userCreated = await Users.create({
      id: firebaseUser.uid,
      first_name: first_name,
      last_name: last_name,
      birthdate: birthdate,
    });
    await Doctors.create({
      id_user: userCreated.id,
      license: license,
      id_area: id_area
    });
    return firebaseUser.uid;
  } catch (error) {
    return error;
  }
};
