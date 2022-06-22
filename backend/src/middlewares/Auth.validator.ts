import { NextFunction, Request, Response } from "express";
import * as admin from "firebase-admin";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    res.statusCode = 401;
    return res.send({
      error: "Authentication error - header not defined",
    });
  }

  if (!authorization.startsWith("Bearer")) {
    res.statusCode = 401;
    return res.send({
      error: "Authentication error - Bearer missing",
    });
  }

  const splittedToken = authorization.split("Bearer ");

  if (splittedToken.length !== 2) {
    res.statusCode = 401;
    return res.send({
      error: "Authentication error - token missing",
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
