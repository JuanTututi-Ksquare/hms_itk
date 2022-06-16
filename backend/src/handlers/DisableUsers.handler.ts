import { Users } from "../models/Users.model";

export const DisableUser = async (id_user: number) => {
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
      return { success: "User was disabled successfully!" };
    }
  } catch (error) {
    return error;
  }
};
