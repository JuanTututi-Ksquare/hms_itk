import { Areas } from "../models/Areas.model";
import { Doctors } from "../models/Doctors.model";
import { Users } from "../models/Users.model";

export const GetDoctorOptions = async () => {
  try {
    let result = [];
    const doctors = await Doctors.findAll({
      where: {
        availability: true,
      },
    });
    if (doctors) {
      for (let i = 0; i < doctors.length; i++) {
        const doctor = doctors[i];
        const doctorUser = await Users.findOne({
          where: {
            id: doctor.id_user,
          },
        });
        if (doctorUser) {
          const doctorName = `${doctorUser.first_name} ${doctorUser.last_name}`;
          const area = await Areas.findOne({
            where: {
              id: doctor.id_area,
            },
          });
          if (area) {
            const areaName = area.area;
            const areaId = doctor.id_area;
            const id = doctor.id;
            result.push({ id, doctorName, areaId, areaName });
          }
        }
      }
    }
    return result;
  } catch (error) {
    return error;
  }
};
