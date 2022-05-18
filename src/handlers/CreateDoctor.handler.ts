import { Users } from "../models/Users.model";
import { Doctors } from "../models/Doctors.model";

export const CreateDoctor = async (
  first_name: string,
  last_name: string,
  birthdate: Date,
  license: string,
  id_area: number,
  email: string,
  password: string,
) => {
//   try {
//     const userCreated = await Users.create({
//       id: id,
//       first_name: first_name,
//       last_name: last_name,
//       birthdate: birthdate,
//     });
//     await Doctors.create({
//       id_user: userCreated.id,
//       license: license,
//       id_area: id_area,
//     });
//     return "Doctor registration was succesful!";
//   } catch (error) {
//     return error;
//   }
};
