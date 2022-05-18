import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Sequelize,
} from "sequelize";
import { Appointments } from "./Appointments.model";

export class Patients extends Model<
  InferAttributes<Patients>,
  InferCreationAttributes<Patients>
> {
  declare id: CreationOptional<number>;
  declare id_user: string;
  declare curp: string;
  declare nss: CreationOptional<string>;
}

export const initPatientsModel = (sequelize: Sequelize) => {
  Patients.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_user: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      curp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nss: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "patients",
      sequelize: sequelize,
    }
  );

  Patients.sync();
  Patients.hasMany(Appointments, {
    foreignKey: "id_patient",
  });
};
