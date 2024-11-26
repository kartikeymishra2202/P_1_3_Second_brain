import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET_ = process.env.JWT_SECRET;
import { Router } from "express";
import jwt from "jsonwebtoken";
import { any, z } from "zod";
import bcrypt from "bcryptjs";
import UserModel from "../model/userModel";

if (!JWT_SECRET_) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}

const userRoutes = Router();

userRoutes.post("/signup", async function (req: any, res: any) {
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  //-------ZOD-Validation-----
  const requireBody = z.object({
    email: z.string().min(3).max(100).email(),
    name: z.string().min(3).max(100),
    password: z.string().min(5).max(30),
  });

  const parsedDataWithSuccess = requireBody.safeParse(req.body);
  if (!parsedDataWithSuccess.success) {
    res.status(401).json({
      message: "Incorrect Format",
      error: parsedDataWithSuccess.error,
    });
    return;
  }

  const hashPassword = await bcrypt.hash(password, 5);

  try {
    await UserModel.create({
      email: email,
      name: name,
      password: hashPassword,
    });
  } catch (err: any) {
    return res.status(401).json({
      message: err.errmsg,
    });
  }

  return res.status(201).json({
    message: "You are signed in",
  });
});

userRoutes.post("/signin", async function (req: any, res: any) {
  const email = req.body.email;
  const password = req.body.password;

  const user = await UserModel.findOne({
    email: email,
  });
  if (!user) return res.status(401).json({ message: "user does not found" });
  const UserPassword = user.password;
  if (!UserPassword) {
    throw new Error("UserPassword is not defined");
  }

  const passwordMatch = await bcrypt.compare(password, UserPassword);
  if (passwordMatch) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_SECRET_,
      { expiresIn: "1h" }
    );
    //setting the token in cookies--------------------------------------------------------------------
    //In order to add cookies first include cookie-parser for typescript use @type/cookie parser.
    res.cookie("token", token, {
      httpOnly: true, // Prevent client-side JavaScript from accessing the cookie

      maxAge: 60 * 60 * 1000, // 1 hour (in milliseconds)
      sameSite: "strict", // Prevent CSRF attacks
    });
    //---------------------------------------------------------------------------------------------

    return res.status(201).json({
      token,
    });
  } else {
    return res.status(401).json({
      message: "Password is Incorrect",
    });
  }
});

userRoutes.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({
    message: "Logout Successfully",
  });
});

export default userRoutes;
