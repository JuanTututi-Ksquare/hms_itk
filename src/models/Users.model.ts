import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Sequelize,
} from "sequelize";
import { Patients } from "./Patients.model";

export class Users extends Model<
  InferAttributes<Users>,
  InferCreationAttributes<Users>
> {
  declare id_role: number;
  declare id: CreationOptional<number>;
  declare first_name: string;
  declare last_name: string;
  declare birthdate: Date;
  declare email: string;
  declare password: string;
  declare is_deleted: CreationOptional<boolean>;
}

export const initUsersModel = (sequelize: Sequelize) => {
  Users.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      id_role: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
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
};
