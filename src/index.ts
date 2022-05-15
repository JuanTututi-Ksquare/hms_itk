import express from "express";
import dotenv from "dotenv";
import { DBConn } from "./models/index";

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT;
const db_name = <string>process.env.DB_NAME;
const db_username = <string>process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;

app.listen(port, async () => {
    console.log("app is up at port:", port);
    try {
        const connection = await DBConn(db_name, db_username, db_password, db_host);
        console.log("Connection to DB was succesful")
    } catch (error) {
        console.log(error);
    }
})