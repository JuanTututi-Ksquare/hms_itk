// import {
//   Model,
//   InferAttributes,
//   InferCreationAttributes,
//   CreationOptional,
//   DataTypes,
//   Sequelize,
// } from "sequelize";

// import { Users } from "./Users.model";

// export class Roles extends Model<
//   InferAttributes<Roles>,
//   InferCreationAttributes<Roles>
// > {
//   declare id: CreationOptional<number>;
//   declare role: string;
// }

// export const initRolesModel = (sequelize: Sequelize) => {
//   Roles.init(
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true,
//       },
//       role: {
//         type: DataTypes.STRING,
//       },
//     },
//     {
//       tableName: "roles",
//       sequelize: sequelize,
//     }
//   );

//   Roles.sync();
//   Roles.hasMany(Users, {
//     foreignKey: "id_role",
//   });
// };
