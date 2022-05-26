import {
  InferAttributes,
  InferCreationAttributes,
  Model,
  DataTypes,
  CreationOptional,
  Sequelize,
} from "sequelize";

export class Contact extends Model<
  InferAttributes<Contact>,
  InferCreationAttributes<Contact>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare message: string;
}

export const initContactModel = async (sequelize: Sequelize) => {
  await Contact.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
          type: DataTypes.STRING,
          allowNull: false
      },
      message: {
          type: DataTypes.STRING,
          allowNull: false,
      }
    },
    {
      tableName: "contact",
      sequelize: sequelize,
    }
  );
  await Contact.sync();
};
