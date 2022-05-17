import express, {Request, Response} from "express";
import dotenv from "dotenv";
import { DBConn } from "./models/Index.model";
import { PatientRouter } from "./routes/Patient.routes";
import { PopulateRoles, PopulateAreas } from "./config/PopulateModels.config";
import { AdminRouter } from "./routes/Admin.routes";

dotenv.config();

const app = express();
const port = process.env.PORT;
const db_name = <string>process.env.DB_NAME;
const db_username = <string>process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_host = process.env.DB_HOST;

app.use(express.json());

// Routes
app.use("/patient", PatientRouter);
app.use("/admin", AdminRouter);

app.get("/", (req: Request, res: Response) => {
  res.send(req.originalUrl);
});

app.listen(port, async () => {
  console.log("app is up at port:", port);
  try {
    await DBConn(db_name, db_username, db_password, db_host);
    console.log("Connection to DB was succesful");
  } catch (error) {
    console.log(error);
  }
  try {
    await PopulateAreas();
    await PopulateRoles();
  } catch (error) {
    console.log(error)
  }
});
