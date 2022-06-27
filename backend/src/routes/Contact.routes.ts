import { Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import { badRequest, internalServerError } from "../config/CustomRespones";
import { Pagination } from "../config/CustomTypes";
import { CreateContactMessage } from "../handlers/CreateContactMessage.handler";
import { GetContactMessages } from "../handlers/GetContactMessages.handler";
import { checkAuth } from "../middlewares/Auth.validator";
import { IsDeleted } from "../middlewares/IsDeleted.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const ContactRouter = Router();

// Create new message
ContactRouter.post(
  "/",
  body("email")
    .exists()
    .withMessage("Email is missing")
    .isEmail()
    .withMessage("Email is not valid"),
  body("message")
    .exists()
    .withMessage("Message is missing")
    .isString()
    .withMessage("Message must be a string")
    .isLength({ min: 30 })
    .withMessage("Message should be at least 30 chars"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ ...badRequest, errors: errors.array() });
    }
    const { email, message } = req.body;
    try {
      const msg = await CreateContactMessage(email, message);
      return res.status(201).send(msg);
    } catch (error) {
      return res.status(500).send(internalServerError);
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
    
    let pagination: Pagination = { page: 1, limit: 5 };

    if (req.query.page && typeof req.query.page === "string") {
      const page = +req.query.page;
      if (!Number.isNaN(page)) {
        pagination["page"] = page;
      } else {
        return res.status(400).send({ error: "Invalid request!" });
      }
    }

    try {
      const messages = await GetContactMessages(pagination);
      return res.status(200).send(messages);
    } catch (error) {
      return res.status(500).send(internalServerError);
    }
  }
);
