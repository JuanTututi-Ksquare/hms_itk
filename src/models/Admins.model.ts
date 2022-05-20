import {
    InferAttributes,
    InferCreationAttributes,
    Model,
    DataTypes,
    CreationOptional,
    Sequelize,
  } from "sequelize";
  import { Appointments } from "./Appointments.model";
  
  export class Admins extends Model<
    InferAttributes<Admins>,
    InferCreationAttributes<Admins>
  > {
    declare id: CreationOptional<number>;
    declare id_user: string;
  }
  
  export const initAdminsModel = (sequelize: Sequelize) => {
    Admins.init(
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
      },
      {
        tableName: "admins",
        sequelize: sequelize,
      }
    );
    Admins.sync();
  };