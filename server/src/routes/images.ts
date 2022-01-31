import express from "express";
import aws from "aws-sdk";
import multer from "multer";
import { checkJwt } from "../auth/auth";
import { getImage, uploadImages } from "../services/imageService";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 5000000 } });

const router = express.Router();

// Configuration for aws s3
aws.config.update({ region: "eu-west-1" });
const s3 = new aws.S3();
const defaultBucket = "randohub";

router.get("/image/:key", async (req, res) => {
  const key = req.params.key;
  const bucket = req.params.bucket;
  if (!key) return res.status(400).json("Missing object key");
  const data = await getImage(key, bucket);
  return data ? res.status(200).send(data) : res.status(400).send("Get image failed.");
});

router.post("/image", checkJwt, upload.array("images"), async (req, res) => {
  const imageIds = req.body.imageIds;
  const files = req.files;
  const bucket = req.body.bucket;
  if (!imageIds) return res.status(200).json({ Error: "No image ids in request" });
  if (!files || files.length === 0 || !Array.isArray(files)) {
    return res.status(400).json({ Error: "No files in request" });
  }
  const data = await uploadImages(imageIds, files, bucket);
  res.status(data.error ? 500 : 200).json(data);
});

router.delete("/images", checkJwt, async (req, res) => {
  const body = req.body;
  if (!body || !body.imageIds || body.imageIds.length === 0) {
    return res.status(400).json({ error: "No image ids in request" });
  }
  const params: any = {
    Bucket: req.body.bucket ? req.body.bucket : defaultBucket,
    Delete: {
      Objects: body.imageIds.map((id: string) => ({ Key: id })),
      Quiet: false,
    },
  };
  s3.deleteObjects(params, (err, data) => {
    if (err) return res.status(400).json({ error: err });
    else res.status(200).json(`${body.imageIds.length} images deleted`);
  });
});

export default router;
