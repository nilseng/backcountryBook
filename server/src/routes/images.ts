import express from "express"
import aws from "aws-sdk"

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
    s3.getObject(params, (err, data) => {
        if (err) res.status(400).json(err);
        else res.status(200).send(data.Body);
    });
});

export default router