import { Op, OrderItem } from "sequelize";
import {
  AdminFilters as Filters,
  DoctorFilters,
  Pagination,
} from "../config/CustomTypes";
import { Appointments } from "../models/Appointments.model";
import { Patients } from "../models/Patients.model";

// Admin
// Get all appointments
export const getAllAppointments = async (
  pagination: Pagination,
  filters?: Filters
) => {
  const pageNumber = pagination["page"] <= 0 ? 1 : pagination["page"];
  const limit = pagination["limit"];
  const offset = (pageNumber - 1) * limit;
  if (filters) {
    try {
      const appointments = await Appointments.findAll({
        where: {
          ...filters,
        },
        offset: offset,
        limit: limit,
      });
      if (appointments.length) {
        return appointments;
      } else {
        return { info: "No results were found!" };
      }
    } catch (error) {
      return error;
    }
  } else {
    try {
      const appointments = await Appointments.findAll({
        offset: offset,
        limit: limit,
      });
      return appointments;
    } catch (error) {
      return error;
    }
  }
};

// Patient
export const getPatientAppointments = async (uid: number) => {
  try {
    const patient = await Patients.findOne({
      where: {
        id_user: uid,
      },
    });
    if (!patient) {
      throw new Error(`User with id: ${uid} doesn't exists!`);
    }
    const list = await Appointments.findAll({
      where: {
        id_patient: patient.id,
        status: true,
      },
    });
    if (!list.length) {
      return { info: "No results were found!" };
    } else {
      return list;
    }
  } catch (error) {
    return error;
  }
};

export const getSinglePatientAppointment = async (id_appointment: number) => {
  try {
    const appointment = await Appointments.findOne({
      where: {
        id: id_appointment,
        status: true,
      },
    });
    if (appointment) {
      return appointment;
    } else {
      return { info: "No results were found!" };
    }
  } catch (error) {
    return error;
  }
};

// Doctor
export const getDoctorAppointments = async (
  id_doctor: number,
  pagination: Pagination,
  filters?: DoctorFilters
) => {
  const pageNumber = pagination["page"] <= 0 ? 1 : pagination["page"];
  const limit = pagination["limit"];
  const offset = (pageNumber - 1) * limit;

  if (
    filters &&
    Object.keys(filters).includes("date") &&
    !Object.keys(filters).includes("orderByPatient") &&
    !Object.keys(filters).includes("orderByDate")
  ) {
    const { date, dateOrder, ...otherFilters } = filters;
    const initialDate = date + "T00:00:00";
    const endDate = date + "T24:00:00";
    let order = [];

    let finalDateOrder = "ASC";
    if (dateOrder) {
      finalDateOrder = <string>filters["dateOrder"];
    }
    order.push(["date", finalDateOrder] as OrderItem);

    try {
      const appointments = await Appointments.findAll({
        where: {
          ...otherFilters,
          id_doctor: id_doctor,
          date: { [Op.between]: [initialDate, endDate] },
          status: true,
        },
        offset: offset,
        limit: limit,
        order: [...order],
      });
      if (appointments.length) {
        return appointments;
      } else {
        return { info: "No results were found!" };
      }
    } catch (error) {
      return error;
    }
  }

  if (
    filters &&
    Object.keys(filters).includes("id_patient") &&
    !Object.keys(filters).includes("orderByPatient") &&
    !Object.keys(filters).includes("orderByDate") &&
    !Object.keys(filters).includes("date")
  ) {
    try {
      const appointments = await Appointments.findAll({
        where: {
          ...filters,
          id_doctor: id_doctor,
          status: true,
        },
        offset: offset,
        limit: limit,
      });
      if (appointments.length) {
        return appointments;
      } else {
        return { info: "No results were found!" };
      }
    } catch (error) {
      return error;
    }
  }

  if (
    filters &&
    (Object.keys(filters).includes("orderByPatient") ||
      Object.keys(filters).includes("orderByDate"))
  ) {
    const order = Object.keys(filters).includes("orderByPatient")
      ? (["id_patient", filters["orderByPatient"]] as OrderItem)
      : (["date", filters["orderByDate"]] as OrderItem);
      console.log(order);
    try {
      const appointments = await Appointments.findAll({
        where: {
          id_doctor: id_doctor,
          status: true,
        },
        offset: offset,
        limit: limit,
        order: [order],
      });
      if (appointments.length) {
        return appointments;
      } else {
        return { info: "No results were found!" };
      }
    } catch (error) {
      return error;
    }
  }

  try {
    const appointments = await Appointments.findAll({
      where: {
        id_doctor: id_doctor,
        status: true,
      },
      offset: offset,
      limit: limit,
    });
    if (appointments.length) {
      return appointments;
    } else {
      return { info: "No results were found!" };
    }
  } catch (error) {
    return error;
  }
};
