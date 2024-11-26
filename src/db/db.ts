import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;
    if (!mongoUrl) {
      throw new Error("MONGO_URL is not defined in the environment variables");
    }
    const con = await mongoose.connect(mongoUrl);
    console.log("DB connected");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
