import express from "express";
import dotenv from "dotenv";

dotenv.config();

const server = express();
server.use(express.json());

const port = process.env.PORT;

server.listen(port, () => {
    console.log("Server is up at port:", port);
})