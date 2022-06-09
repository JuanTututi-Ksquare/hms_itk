import { Request, Response } from "express";
import * as admin from "firebase-admin";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: Function // There is an interface in express called NextFunction
) => {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    res.statusCode = 401;
    // Please create a single object for your 401 error and use it in every validation
    return res.send({
      error: "Authentication error",
    });
  }

  if (!authorization.startsWith("Bearer")) {
    res.statusCode = 401;
    return res.send({
      error: "Authentication error",
    });
  }

  const splittedToken = authorization.split("Bearer ");

  if (splittedToken.length !== 2) {
    res.statusCode = 401;
    return res.send({
      error: "Authentication error",
    });
  }

  const [_, token] = authorization.split("Bearer ")

  //   Token decoding
  try {
    const decodedToken: admin.auth.DecodedIdToken = await admin
      .auth()
      .verifyIdToken(token);
    res.locals = {
      ...res.locals,
      email: decodedToken.email,
      uid: decodedToken.uid,
      role: decodedToken.role,
    };
    return next();
  } catch (error) {
    console.error(error);
    res.statusCode = 401;
    return res.send({
      error: "Authentication error",
    });
  }
};
