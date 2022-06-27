import { Op, OrderItem } from "sequelize";
import { AdminFilters, DoctorFilters, Pagination } from "../config/CustomTypes";
import { Appointments } from "../models/Appointments.model";
import { Doctors } from "../models/Doctors.model";
import { Patients } from "../models/Patients.model";
import { Users } from "../models/Users.model";

// Admin
// Get all appointments
export const getAllAppointments = async (
  pagination: Pagination,
  filters?: AdminFilters
) => {
  const pageNumber = pagination["page"] <= 0 ? 1 : pagination["page"];
  const limit = pagination["limit"];
  const offset = (pageNumber - 1) * limit;

  if (filters && !filters["orderByPatient"] && !filters["orderByDoctor"]) {
    let result = [];
    let count = 0;
    try {
      // We count the number of appointments to send it on request
      const totalAppointments = await Appointments.findAll({
        where: {
          ...filters,
        },
      });
      if (totalAppointments.length) {
        count = totalAppointments.length;
      }

      const appointments = await Appointments.findAll({
        where: {
          ...filters,
        },
        offset,
        limit,
        order: [["date", "DESC"]],
      });
      if (appointments) {
        for (const appointment of appointments) {
          const doctor = await Doctors.findOne({
            where: {
              id: appointment.id_doctor,
            },
          });
          const patient = await Patients.findOne({
            where: {
              id: appointment.id_patient,
            },
          });
          if (doctor && patient) {
            const doctorUser = await Users.findOne({
              where: {
                id: doctor.id_user,
              },
            });
            const patientUser = await Users.findOne({
              where: {
                id: patient.id_user,
              },
            });
            if (doctorUser && patientUser) {
              const { id, date, id_patient, id_doctor, status } = appointment;
              const patientName = `${patientUser.first_name} ${patientUser.last_name}`;
              const doctorName = `${doctorUser.first_name} ${doctorUser.last_name}`;
              result.push({
                id,
                date,
                id_patient,
                id_doctor,
                patientName,
                doctorName,
                status,
              });
            }
          } else {
            throw new Error("Internal Server Error");
          }
        }
      }
      return { appointments: result, count, filters };
    } catch (error) {
      return error;
    }
  }

  if (
    filters &&
    (Object.keys(filters).includes("orderByPatient") ||
      Object.keys(filters).includes("orderByDoctor"))
  ) {
    const order = Object.keys(filters).includes("orderByPatient")
      ? (["id_patient", filters["orderByPatient"]] as OrderItem)
      : (["id_doctor", filters["orderByDoctor"]] as OrderItem);
    try {
      let result = [];
      let count = 0;
      const totalAppointments = await Appointments.findAll();
      if (totalAppointments.length) {
        count = totalAppointments.length;
      }

      const appointments = await Appointments.findAll({
        offset,
        limit,
        order: [order],
      });
      if (appointments) {
        for (const appointment of appointments) {
          const doctor = await Doctors.findOne({
            where: {
              id: appointment.id_doctor,
            },
          });
          const patient = await Patients.findOne({
            where: {
              id: appointment.id_patient,
            },
          });
          if (doctor && patient) {
            const doctorUser = await Users.findOne({
              where: {
                id: doctor.id_user,
              },
            });
            const patientUser = await Users.findOne({
              where: {
                id: patient.id_user,
              },
            });
            if (doctorUser && patientUser) {
              const { id, date, id_patient, id_doctor, status } = appointment;
              const patientName = `${patientUser.first_name} ${patientUser.last_name}`;
              const doctorName = `${doctorUser.first_name} ${doctorUser.last_name}`;
              result.push({
                id,
                date,
                id_patient,
                id_doctor,
                patientName,
                doctorName,
                status,
              });
            }
          } else {
            throw new Error("Internal Server Error");
          }
        }
      }
      return { appointments: result, count, filters };
    } catch (error) {
      return error;
    }
  }

  try {
    let result = [];
    let count = 0;
    const totalAppointments = await Appointments.findAll();
    if (totalAppointments.length) {
      count = totalAppointments.length;
    }
    const appointments = await Appointments.findAll({
      offset,
      limit,
      order: [["date", "DESC"]],
    });
    if (appointments) {
      for (const appointment of appointments) {
        const doctor = await Doctors.findOne({
          where: {
            id: appointment.id_doctor,
          },
        });
        const patient = await Patients.findOne({
          where: {
            id: appointment.id_patient,
          },
        });
        if (doctor && patient) {
          const doctorUser = await Users.findOne({
            where: {
              id: doctor.id_user,
            },
          });
          const patientUser = await Users.findOne({
            where: {
              id: patient.id_user,
            },
          });
          if (doctorUser && patientUser) {
            const { id, date, id_patient, id_doctor, status } = appointment;
            const patientName = `${patientUser.first_name} ${patientUser.last_name}`;
            const doctorName = `${doctorUser.first_name} ${doctorUser.last_name}`;
            result.push({
              id,
              date,
              id_patient,
              id_doctor,
              patientName,
              doctorName,
              status,
            });
          }
        } else {
          throw new Error("Internal Server Error");
        }
      }
    }
    return { appointments: result, count };
  } catch (error) {
    return error;
  }
};

// Patient
export const getPatientAppointments = async (
  uid: number,
  pagination: Pagination
) => {
  const page = pagination["page"];
  const limit = pagination["limit"];
  const offset = (page - 1) * limit;
  let result = [];
  let count = 0;
  try {
    const patient = await Patients.findOne({
      where: {
        id_user: uid,
      },
    });
    if (!patient) {
      throw new Error(`User with id: ${uid} doesn't exists!`);
    }

    const totalAppointments = await Appointments.findAll({
      where: {
        id_patient: patient.id,
        status: true,
      },
    });

    count = totalAppointments.length;

    const list = await Appointments.findAll({
      where: {
        id_patient: patient.id,
        status: true,
      },
      offset,
      limit,
      order: [["date", "DESC"]],
    });
    if (list) {
      for (const appointment of list) {
        const doctor = await Doctors.findOne({
          where: {
            id: appointment.id_doctor,
          },
        });
        const patient = await Patients.findOne({
          where: {
            id: appointment.id_patient,
          },
        });
        if (doctor && patient) {
          const doctorUser = await Users.findOne({
            where: {
              id: doctor.id_user,
            },
          });
          const patientUser = await Users.findOne({
            where: {
              id: patient.id_user,
            },
          });
          if (doctorUser && patientUser) {
            const { id, date, id_patient, id_doctor, status } = appointment;
            const patientName = `${patientUser.first_name} ${patientUser.last_name}`;
            const doctorName = `${doctorUser.first_name} ${doctorUser.last_name}`;
            result.push({
              id,
              date,
              id_patient,
              id_doctor,
              patientName,
              doctorName,
              status,
            });
          }
        } else {
          throw new Error("Internal Server Error");
        }
      }
    }
    return { appointments: result, count };
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
    return appointment;
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
      let result = [];
      let count = 0;

      const totalAppointments = await Appointments.findAll({
        where: {
          ...otherFilters,
          id_doctor,
          date: { [Op.between]: [initialDate, endDate] },
          status: true,
        },
      });
      count = totalAppointments.length;

      const appointments = await Appointments.findAll({
        where: {
          ...otherFilters,
          id_doctor,
          date: { [Op.between]: [initialDate, endDate] },
          status: true,
        },
        offset,
        limit,
        order: [...order],
      });
      if (appointments) {
        for (const appointment of appointments) {
          const doctor = await Doctors.findOne({
            where: {
              id: appointment.id_doctor,
            },
          });
          const patient = await Patients.findOne({
            where: {
              id: appointment.id_patient,
            },
          });
          if (doctor && patient) {
            const doctorUser = await Users.findOne({
              where: {
                id: doctor.id_user,
              },
            });
            const patientUser = await Users.findOne({
              where: {
                id: patient.id_user,
              },
            });
            if (doctorUser && patientUser) {
              const { id, date, id_patient, id_doctor, status } = appointment;
              const patientName = `${patientUser.first_name} ${patientUser.last_name}`;
              const doctorName = `${doctorUser.first_name} ${doctorUser.last_name}`;
              result.push({
                id,
                date,
                id_patient,
                id_doctor,
                patientName,
                doctorName,
                status,
              });
            }
          } else {
            throw new Error("Internal Server Error");
          }
        }
      }
      return { appointments: result, count, filters };
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
      let result = [];
      let count = 0;

      const totalAppointments = await Appointments.findAll({
        where: {
          ...filters,
          id_doctor,
          status: true,
        },
      });

      count = totalAppointments.length;

      const appointments = await Appointments.findAll({
        where: {
          ...filters,
          id_doctor,
          status: true,
        },
        offset,
        limit,
      });
      if (appointments) {
        for (const appointment of appointments) {
          const doctor = await Doctors.findOne({
            where: {
              id: appointment.id_doctor,
            },
          });
          const patient = await Patients.findOne({
            where: {
              id: appointment.id_patient,
            },
          });
          if (doctor && patient) {
            const doctorUser = await Users.findOne({
              where: {
                id: doctor.id_user,
              },
            });
            const patientUser = await Users.findOne({
              where: {
                id: patient.id_user,
              },
            });
            if (doctorUser && patientUser) {
              const { id, date, id_patient, id_doctor, status } = appointment;
              const patientName = `${patientUser.first_name} ${patientUser.last_name}`;
              const doctorName = `${doctorUser.first_name} ${doctorUser.last_name}`;
              result.push({
                id,
                date,
                id_patient,
                id_doctor,
                patientName,
                doctorName,
                status,
              });
            }
          } else {
            throw new Error("Internal Server Error");
          }
        }
      }
      return {appointments: result, count, filters};
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
    try {
      let result = [];
      let count = 0;
      const totalAppointments = await Appointments.findAll({
        where: {
          id_doctor,
          status: true,
        }
      })
      count = totalAppointments.length;
      const appointments = await Appointments.findAll({
        where: {
          id_doctor,
          status: true,
        },
        offset,
        limit,
        order: [order],
      });
      if (appointments) {
        for (const appointment of appointments) {
          const doctor = await Doctors.findOne({
            where: {
              id: appointment.id_doctor,
            },
          });
          const patient = await Patients.findOne({
            where: {
              id: appointment.id_patient,
            },
          });
          if (doctor && patient) {
            const doctorUser = await Users.findOne({
              where: {
                id: doctor.id_user,
              },
            });
            const patientUser = await Users.findOne({
              where: {
                id: patient.id_user,
              },
            });
            if (doctorUser && patientUser) {
              const { id, date, id_patient, id_doctor, status } = appointment;
              const patientName = `${patientUser.first_name} ${patientUser.last_name}`;
              const doctorName = `${doctorUser.first_name} ${doctorUser.last_name}`;
              result.push({
                id,
                date,
                id_patient,
                id_doctor,
                patientName,
                doctorName,
                status,
              });
            }
          } else {
            throw new Error("Internal Server Error");
          }
        }
      }
      return {appointments: result, count, filters};
    } catch (error) {
      return error;
    }
  }

  try {
    let result = [];
    let count = 0;

    const totalAppointments = await Appointments.findAll({
      where: {
        id_doctor,
        status: true,
      },
    });
    count = totalAppointments.length;

    const appointments = await Appointments.findAll({
      where: {
        id_doctor,
        status: true,
      },
      offset,
      limit,
      order: [["date", "DESC"]],
    });
    if (appointments) {
      for (const appointment of appointments) {
        const doctor = await Doctors.findOne({
          where: {
            id: appointment.id_doctor,
          },
        });
        const patient = await Patients.findOne({
          where: {
            id: appointment.id_patient,
          },
        });
        if (doctor && patient) {
          const doctorUser = await Users.findOne({
            where: {
              id: doctor.id_user,
            },
          });
          const patientUser = await Users.findOne({
            where: {
              id: patient.id_user,
            },
          });
          if (doctorUser && patientUser) {
            const { id, date, id_patient, id_doctor, status } = appointment;
            const patientName = `${patientUser.first_name} ${patientUser.last_name}`;
            const doctorName = `${doctorUser.first_name} ${doctorUser.last_name}`;
            result.push({
              id,
              date,
              id_patient,
              id_doctor,
              patientName,
              doctorName,
              status,
            });
          }
        } else {
          throw new Error("Internal Server Error");
        }
      }
    }
    return { appointments: result, count };
  } catch (error) {
    return error;
  }
};
