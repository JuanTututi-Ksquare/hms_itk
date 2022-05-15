"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBConn = void 0;
const sequelize_1 = require("sequelize");
const DBConn = (db_name, db_username, db_password, db_host) => {
    const sequelize = new sequelize_1.Sequelize(db_name, db_username, db_password, {
        host: db_host,
        dialect: "postgres",
    });
    sequelize.sync({});
    return sequelize;
};
exports.DBConn = DBConn;
