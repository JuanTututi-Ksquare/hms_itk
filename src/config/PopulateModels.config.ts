import { Roles } from "../models/Roles.model";

enum roles {
  Patient = "patient",
  Doctor = "doctor",
  Admin = "admin",
}

export const PopulateRoles = () => {
  Object.values(roles).forEach(async (element) => {
    await Roles.findOrCreate({
      where: {
        role: element,
      },
      defaults: {
        role: element,
      },
    });
  });
};