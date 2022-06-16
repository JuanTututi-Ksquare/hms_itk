import { Request, Response, Router } from "express";
import { internalServerError } from "../config/CustomRespones";
import { DisableUser } from "../handlers/DisableUsers.handler";
import { checkAuth } from "../middlewares/Auth.validator";
import { checkExistingUser } from "../middlewares/Exists.validator";
import { IsDeleted } from "../middlewares/IsDeleted.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const AuthRouter = Router();

// Disable account
AuthRouter.delete(
  "/",
  checkAuth,
  // Check if user is not deleted
  IsDeleted,
  roleValidator(["admin", "doctor", "patient"]),
  checkExistingUser,
  async (req: Request, res: Response) => {
    try {
      const { uid } = res.locals;
      const user = await DisableUser(uid);
      res.status(200).send(user);
    } catch (error) {
      res
        .status(500)
        .send(internalServerError);
    }
  }
);