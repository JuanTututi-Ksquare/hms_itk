import * as firebaseAdmin from "firebase-admin";
import { Users } from "../models/Users.model";

export const ActivateUser = async (id_user: string) => {
  try {
    const activatedUser = await Users.update(
      {
        is_deleted: false,
      },
      {
        where: {
          id: id_user,
        },
      }
    );
    if (activatedUser) {
      await firebaseAdmin.auth().updateUser(id_user, {
        disabled: false,
      });
      return { success: "User activated successfully", id: id_user};
    }
  } catch (error) {
    return error;
  }
};
