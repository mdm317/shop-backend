import express from "express";
import { addImageController } from "../Controllers/image";
import multer from "multer";
import path from "path";
const imageRouter = express.Router();

import multerS3 from "multer-s3";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const upload = multer({
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: "yun-shop",
    key(req, file, cb) {
      cb(null, `original/${Date.now()}_${path.basename(file.originalname)}`);
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

imageRouter.post("/add/:idx", upload.array("image"), addImageController);

export default imageRouter;
