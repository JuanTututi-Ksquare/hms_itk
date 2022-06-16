import * as firebaseAdmin from "firebase-admin";
import { firebaseUser } from "../config/CustomTypes";

export const createFirebaseUser = async (user: firebaseUser) => {
  const role = user.role;
  const createdUser = await firebaseAdmin.auth().createUser({
    displayName: `${user.first_name} ${user.last_name}`,
    email: user.email,
    password: user.password,
  });
  await firebaseAdmin.auth().setCustomUserClaims(createdUser.uid, { role });
  return createdUser;
};
