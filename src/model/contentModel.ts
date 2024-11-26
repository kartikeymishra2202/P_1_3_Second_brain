import mongoose from "mongoose";
const Schema = mongoose.Schema;

const content = new Schema({
  title: String,
  link: String,
  tags: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Tag",
    },
  ],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const contentModel = mongoose.model("content", content);

export default contentModel;
