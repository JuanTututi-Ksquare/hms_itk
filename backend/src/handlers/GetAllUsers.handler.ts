import { Pagination, UserFilters } from "../config/CustomTypes";
import { Doctors } from "../models/Doctors.model";
import { Patients } from "../models/Patients.model";
import { Users } from "../models/Users.model";

export const GetAllUsers = async (
  filters: UserFilters,
  pagination: Pagination
) => {
  const page = pagination["page"];
  const limit = pagination["limit"];
  const offset = (page - 1) * limit;
  try {
    if ("is_deleted" in filters) {
      const users = await Users.findAll({
        where: {
          ...filters,
        },
        include: [
          {
            model: Patients,
          },
          {
            model: Doctors,
          },
        ],
        limit,
        offset,
      });
      return users;
    } else {
      const users = await Users.findAll({
        include: [
          {
            model: Patients,
          },
          {
            model: Doctors,
          },
        ],
        limit,
        offset,
      });
      return users;
    }
  } catch (error) {
    return error;
  }
};
