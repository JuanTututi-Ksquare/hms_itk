import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Sequelize,
} from "sequelize";
import { Doctors } from "./Doctors.model";
import { Patients } from "./Patients.model";

export class Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>
> {
  declare id: string;
  declare first_name: string;
  declare last_name: string;
  declare birthdate: Date;
  declare is_deleted: CreationOptional<boolean>;
}

export const initUsersModel = (sequelize: Sequelize) => {
  Users.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "users",
      sequelize: sequelize,
    }
  );

  Users.sync();

  Users.hasOne(Patients, {
    foreignKey: "id_user",
  });

  Users.hasOne(Doctors, {
    foreignKey: "id_user",
  });
};
