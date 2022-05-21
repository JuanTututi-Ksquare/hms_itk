import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
  CreationOptional,
  Sequelize,
} from "sequelize";
import { Doctors } from "./Doctors.model";

export class Areas extends Model<
  InferAttributes<Areas>,
  InferCreationAttributes<Areas>
> {
  declare id: CreationOptional<number>;
  declare area: string;
}

export const initAreasModel = async (sequelize: Sequelize) => {
  await Areas.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      area: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "areas",
      sequelize: sequelize,
    }
  );
  await Areas.sync();
  await Areas.hasMany(Doctors, {
    foreignKey: "id_area",
  });
};
