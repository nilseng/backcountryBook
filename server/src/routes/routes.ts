import express from "express";
const tj = require("@mapbox/togeojson");
import fs from "fs";
const DOMParser = require("xmldom").DOMParser;
import { checkJwt } from "../auth/auth"
import aws from "aws-sdk";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Configuration for aws s3
aws.config.update({ region: "eu-west-1" });
const s3 = new aws.S3();
const s3Bucket = "bcbookgpx";

router.get("/route/:routeId", async (req: any, res: any) => {
  if (!req.params.routeId) return res.status(400).json("Missing route id");
  const params = {
    Bucket: s3Bucket,
    Key: req.params.routeId,
  };
  s3.getObject(params, (err: any, data: any) => {
    if (err) res.status(404).json({ message: "Could not find geojson" });
    else res.status(200).json(JSON.parse(data.Body.toString()));
  });
});

router.post("/route", checkJwt, (req: any, res: any) => {
  if (!req.body.geojsonId || !req.body.geojson) {
    return res.status(400).json({ message: "geojsonId or geojson missing" });
  }
  const uploadParams = {
    Bucket: s3Bucket,
    Key: req.body.geojsonId,
    Body: Buffer.from(JSON.stringify(req.body.geojson)),
  };
  s3.upload(uploadParams, (err: any, data: any) => {
    if (err) {
      res.status(400).json({ Error: err });
    } else {
      res.status(200).json("Geojson sucessfully uploaded");
    }
  });
});

router.post(
  "/route/gpxtogeojson",
  checkJwt,
  upload.array("gpx"),
  (req: any, res: any) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No file found" });
    }
    const gpxString = req.files[0].buffer.toString();
    const gpx = new DOMParser().parseFromString(gpxString);
    const geojson = tj.gpx(gpx);
    res.status(200).json(geojson);
  }
);

module.exports = router;
