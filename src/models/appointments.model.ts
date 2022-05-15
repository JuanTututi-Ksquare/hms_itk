import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
  Sequelize,
} from "sequelize";

export class Appointments extends Model<
  InferAttributes<Appointments>,
  InferCreationAttributes<Appointments>
> {
  declare id: CreationOptional<number>;
  declare date: Date;
  declare status: CreationOptional<boolean>;
}

export const initAppointmentsModel = (sequelize: Sequelize) => {
  Appointments.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "appointments",
      sequelize: sequelize,
    }
  );
  Appointments.sync();
};
