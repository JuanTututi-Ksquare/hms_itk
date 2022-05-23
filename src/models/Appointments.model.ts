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
  declare id_doctor: number;
  declare id_patient: number;
  declare date: Date;
  declare status: CreationOptional<boolean>;
}

export const initAppointmentsModel = async (sequelize: Sequelize) => {
  await Appointments.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      id_doctor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_patient: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      tableName: "appointments",
      sequelize: sequelize,
    }
  );
  await Appointments.sync();
};
