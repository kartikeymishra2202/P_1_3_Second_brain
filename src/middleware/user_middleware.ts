import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
dotenv.config();
const JWT_SECRET_ = process.env.JWT_SECRET;

const auth = (req: Request, res: Response, next: NextFunction) => {
  if (!JWT_SECRET_) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({
      message: "Token Not Found",
    });
    return;
  }

  const decoded = jwt.verify(token, JWT_SECRET_);
  if (decoded) {
    // @ts-ignore
    req.userId = decoded.id;
    return next();
  } else {
    res.status(401).json({
      message: "Auth Failed",
    });
    return;
  }
};
export default auth;
