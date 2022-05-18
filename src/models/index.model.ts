import { Sequelize } from "sequelize";
import { initAppointmentsModel } from "./Appointments.model";
import { initAreasModel } from "./Areas.model";
import { initDoctorsModel } from "./Doctors.model";
import { initPatientsModel } from "./Patients.model";
// import { initRolesModel } from "./Roles.model";
import { initUsersModel } from "./Users.model";

export let sequelize: Sequelize;

const models = [
  initAppointmentsModel,
  initDoctorsModel,
  initPatientsModel,
  initAreasModel,
  initUsersModel,
  // initRolesModel,
];

export const DBConn = (
  db_name: string,
  db_username: string,
  db_password: string | undefined,
  db_host: string | undefined
) => {
  const sequelize = new Sequelize(db_name, db_username, db_password, {
    host: db_host,
    dialect: "postgres",
  });

  for (const model of models) {
    model(sequelize);
  }

  sequelize.sync();

  return sequelize;
};
