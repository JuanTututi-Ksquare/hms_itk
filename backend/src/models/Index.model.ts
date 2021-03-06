import { Sequelize } from "sequelize";
import { PopulateAreas, createSU } from "../config/PopulateModels.config";
import { initAdminsModel } from "./Admins.model";
import { initAppointmentsModel } from "./Appointments.model";
import { initAreasModel } from "./Areas.model";
import { initContactModel } from "./Contact.model";
import { initDoctorsModel } from "./Doctors.model";
import { initPatientsModel } from "./Patients.model";
import { initUsersModel } from "./Users.model";

export let sequelize: Sequelize;

const models = [
  initContactModel,
  initAdminsModel,
  initAppointmentsModel,
  initDoctorsModel,
  initPatientsModel,
  initAreasModel,
  initUsersModel,
];

export const DBConn = async (
  db_name: string,
  db_username: string,
  db_password: string | undefined,
  db_host: string | undefined
) => {
  const sequelize = new Sequelize(db_name, db_username, db_password, {
    host: db_host,
    dialect: "postgres",
    timezone: "-05:00"
  });

  for (const model of models) {
    await model(sequelize);
  }

  await sequelize.sync({});

  try {
    await PopulateAreas();
    await createSU();
  } catch (error) {
    console.log(error);
  }

  return sequelize;
};
