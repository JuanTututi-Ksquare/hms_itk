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
      id: "PuZdRtsIAtXAUxNd1Jmc0okbPxs2"
    },
    defaults: {
      id: "PuZdRtsIAtXAUxNd1Jmc0okbPxs2",
      birthdate: new Date("1984-12-24"),
      first_name: "Deus",
      last_name: "Machina",
    }
  });
  Admins.findOrCreate({
    where: {
      id_user: "PuZdRtsIAtXAUxNd1Jmc0okbPxs2"
    }, 
    defaults: {
      id_user: "PuZdRtsIAtXAUxNd1Jmc0okbPxs2"
    } 
  })
}