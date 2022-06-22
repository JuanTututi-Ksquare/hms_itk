import { Admins } from "../models/Admins.model";
import { Areas } from "../models/Areas.model";
import { Users } from "../models/Users.model";

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

export const createSU = async () => {
  await Users.findOrCreate({
    where: {
      id: "YqFdcUMpXBdhamKFhPW28Bofwnn1"
    },
    defaults: {
      id: "YqFdcUMpXBdhamKFhPW28Bofwnn1",
      birthdate: new Date("1700-12-24"),
      first_name: "Deus",
      last_name: "Machina",
    }
  });
  Admins.findOrCreate({
    where: {
      id_user: "YqFdcUMpXBdhamKFhPW28Bofwnn1"
    }, 
    defaults: {
      id_user: "YqFdcUMpXBdhamKFhPW28Bofwnn1"
    } 
  })
}