import mongoose from "mongoose";
const Schema = mongoose.Schema;

const User = new Schema({
  email: {
    type: String,
    unique: true,
  },
  name: String,
  password: {
    type: String,
  },
});
const UserModel = mongoose.model("User", User);

export default UserModel;
