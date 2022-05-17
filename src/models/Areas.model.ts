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

export const initAreasModel = (sequelize: Sequelize) => {
  Areas.init(
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
  Areas.sync();
  Areas.hasMany(Doctors, {
    foreignKey: "id_area",
  });
};
