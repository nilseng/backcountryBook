import express from "express"
import aws from "aws-sdk"
import multer from "multer"
import { checkJwt } from "../auth/auth";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router()

// Configuration for aws s3
aws.config.update({ region: "eu-west-1" });
const s3 = new aws.S3();
const defaultBucket = "randohub";

router.get("/image/:key", (req, res) => {
    if (!req.params.key) return res.status(400).json("Missing object key");
    const params = {
        Bucket: req.params.bucket ? req.params.bucket : defaultBucket,
        Key: req.params.key,
    };
    s3.getObject(params, (err: any, data: any) => {
        if (err) res.status(400).json(err);
        else res.status(200).send(data.Body);
    });
});

router.post("/image", checkJwt, upload.array("images"), async (req, res) => {
    if (!req.body || !req.body.imageIds)
        return res.status(200).json({ Error: "No images in request" });
    if (!req.files || req.files.length === 0)
        return res.status(400).json({ Error: "No files in request" });
    const uploadParams: any = {
        Bucket: req.body.bucket ? req.body.bucket : defaultBucket,
    };
    if (Array.isArray(req.files)) {
        for (const [i, file] of req.files.entries()) {
            uploadParams.Body = file.buffer;
            if (Array.isArray(req.body.imageIds)) {
                uploadParams.Key = req.body.imageIds[i];
            } else {
                uploadParams.Key = req.body.imageIds;
            }
            s3.upload(uploadParams, (err: any, data: any) => {
                if (err) {
                    return res.status(400).json({ Error: err })
                }
                if (i === (req.files.length as number) - 1)
                    res.status(200).json("File(s) sucessfully uploaded");
            });
        }
    }
});

export default router