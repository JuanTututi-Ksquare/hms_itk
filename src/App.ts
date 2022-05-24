import express, {Request, Response} from "express";
import dotenv from "dotenv";
import { initializeApp } from 'firebase-admin/app';
import { DBConn } from "./models/Index.model"
import { PatientRouter } from "./routes/Patient.routes";
import { AdminRouter } from "./routes/Admin.routes";
import { DoctorsRouter } from "./routes/Doctor.routes";

dotenv.config();

const app = express();
initializeApp();
const port = process.env.PORT;
const db_name = <string>process.env.DB_NAME;
const db_username = <string>process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;

app.use(express.json());

// Routes
app.use("/patient", PatientRouter);
app.use("/admin", AdminRouter);
app.use("/doctor", DoctorsRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(req.originalUrl);
});

try {
  DBConn(db_name, db_username, db_password, db_host);
  console.log("Connection to DB succesful! :)");
} catch (error) {
  console.error(error);
}

app.listen(port, () => {
  console.log("Server is up at port:", port);
});