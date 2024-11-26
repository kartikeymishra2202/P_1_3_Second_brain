import { Router } from "express";
import auth from "../middleware/user_middleware";
import contentModel from "../model/contentModel";

const content_routes = Router();

content_routes.post("/addContent", auth, async function (req, res) {
  const link = req.body.link;
  const type = req.body.type;
  try {
    await contentModel.create({
      link: link,
      type: type,
      //@ts-ignore
      userId: req.userId,
      tags: [],
    });
  } catch (err: any) {
    res.status(401).json({
      message: "Could not create content",
      status: err.errmsg,
    });
  }

  res.status(201).json({
    message: "Content added successfull",
  });
});

export default content_routes;
