import { Areas } from "../models/Areas.model";
// import { Roles } from "../models/Roles.model";

// enum roles {
//   Patient = "patient",
//   Doctor = "doctor",
//   Admin = "admin",
// }

enum areas {
  Dermatology = "dermatology",
  InternalMedicine = "internal medicine",
  FamiliarMedicine = "familiar medicine",
  Pediatry = "pediatry",
  Gynecology = "gynecology",
  PreventiveMedicine = "preventive medicine",
  Dentistry = "dentistry",
  Radiology = "radiology",
  Cardiology = "cardiology",
}

// export const PopulateRoles = () => {
//   Object.values(roles).forEach(async (element) => {
//     await Roles.findOrCreate({
//       where: {
//         role: element,
//       },
//       defaults: {
//         role: element,
//       },
//     });
//   });
// };

export const PopulateAreas = () => {
  Object.values(areas).forEach(async (element) => {
    await Areas.findOrCreate({
      where: {
        area: element,
      },
      defaults: {
        area: element,
      },
    });
  });
};
