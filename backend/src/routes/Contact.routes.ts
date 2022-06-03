import { Request, Response, Router } from "express";
import { body } from "express-validator";
import { CreateContactMessage } from "../handlers/CreateContactMessage.handler";
import { GetContactMessages } from "../handlers/GetContactMessages.handler";
import { checkAuth } from "../middlewares/Auth.validator";
import { IsDeleted } from "../middlewares/IsDeleted.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const ContactRouter = Router();

// Create new message
ContactRouter.post(
  "/",
  body("email").exists().isEmail(),
  body("message").exists().isString().isLength({ min: 5 }),
  async (req: Request, res: Response) => {
      const {email, message} = req.body;
      try {
          const msg = await CreateContactMessage(email, message);
          res.status(201).send(msg);
      } catch (error) {
          res.status(500).send({error: "Internal server error, please try again later!"});
      }
  }
);


// Get all messages
ContactRouter.get(
    "/",
    checkAuth,
    // Check if user is not deleted
    IsDeleted,
    roleValidator(["admin"]),
    async (req: Request, res: Response) => {
        try {
            const messages = await GetContactMessages();
            res.status(200).send(messages);
        } catch (error) {
            res.status(500).send("Internal server error, please try again later!");
        }
    }
)