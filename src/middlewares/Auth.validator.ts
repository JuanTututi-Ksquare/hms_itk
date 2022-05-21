import { Request, Response } from "express";
import * as admin from "firebase-admin";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: Function
) => {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    res.statusCode = 401;
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

  const token = splittedToken[1];

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