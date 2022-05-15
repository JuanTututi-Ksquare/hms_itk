import { Sequelize } from "sequelize";

export const DBConn = (db_name: string, db_username: string, db_password: string | undefined, db_host: string | undefined) => {
    const sequelize = new Sequelize(db_name, db_username, db_password, {
        host: db_host,
        dialect: "postgres",
    })

    sequelize.sync({});

    return sequelize;
}