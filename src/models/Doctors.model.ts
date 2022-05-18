import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
  CreationOptional,
  Sequelize,
} from "sequelize";
import { Appointments } from "./Appointments.model";

export class Doctors extends Model<
  InferAttributes<Doctors>,
  InferCreationAttributes<Doctors>
> {
  declare id: CreationOptional<number>;
  declare id_user: string;
  declare id_area: number;
  declare license: string;
  declare availability: CreationOptional<boolean>;
}

export const initDoctorsModel = (sequelize: Sequelize) => {
  Doctors.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_user: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      id_area: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      license: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      availability: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "doctors",
      sequelize: sequelize,
    }
  );
  Doctors.sync();
  Doctors.hasMany(Appointments, {
      foreignKey: "id_doctor"
  })
};
