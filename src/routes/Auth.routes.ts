import { Request, Response, Router } from "express";
import { DisableUser } from "../handlers/DisableUsers.handler";
import { checkAuth } from "../middlewares/Auth.validator";
import { checkExistingUser } from "../middlewares/Exists.validator";
import { roleValidator } from "../middlewares/Role.validator";

export const AuthRouter = Router();

// Disable account
AuthRouter.delete(
  "/",
  checkAuth,
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
        .send({ error: "Internal server error, please try again later! :(" });
    }
  }
);