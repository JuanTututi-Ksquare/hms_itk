import { Role } from "../config/CustomTypes";
import { Users } from "../models/Users.model";
import { Admins } from "../models/Admins.model";
import { createFirebaseUser } from "./CreateFirebaseUser.handler";

export const CreateAdmin = async (
  first_name: string,
  last_name: string,
  birthdate: Date,
  email: string,
  password: string,
) => {
  try {
    const role: Role = "admin";
    const firebaseUser = await createFirebaseUser({
      first_name,
      last_name,
      email,
      password,
      role,
    });
    const userCreated = await Users.create({
      id: firebaseUser.uid,
      first_name,
      last_name,
      birthdate,
    });
    await Admins.create({
      id_user: userCreated.id,
    });
    console.log(
      `New admin created! ID: ${firebaseUser.uid} / Email: ${firebaseUser.email}`
    );
    return { success: "Admin created successfully!", id: firebaseUser.uid };
  } catch (error) {
    return error;
  }
};
