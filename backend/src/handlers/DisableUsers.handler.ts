import * as firebaseAdmin from "firebase-admin";
import { Users } from "../models/Users.model";

export const DisableUser = async (id_user: string) => {
  try {
    const user = await Users.update(
      {
        is_deleted: true,
      },
      {
        where: {
          id: id_user,
        },
      }
    );
    if (user) {
      await firebaseAdmin.auth().updateUser(id_user, {
        disabled: true,
      });
      return { success: "User was disabled successfully!" };
    }
  } catch (error) {
    return error;
  }
};
