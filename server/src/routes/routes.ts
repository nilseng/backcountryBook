import express from "express";
const tj = require("@mapbox/togeojson");
import fs from "fs";
const DOMParser = require("xmldom").DOMParser;
import { checkJwt } from "../auth/auth";
import aws from "aws-sdk";
import multer from "multer";
import { createMapboxUpload, listUploads } from "../services/routeService";
import { isError } from "../utils/errorHandling";

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

router.post("/route/geojson", checkJwt, async (req: any, res: any) => {
  if (!req.body.id || !req.body.geojson) {
    return res.status(400).json({ message: "geojsonId or geojson missing" });
  }
  const uploadParams = {
    Bucket: s3Bucket,
    Key: req.body.id,
    Body: Buffer.from(JSON.stringify(req.body.geojson)),
  };
  const uploadRes = await s3
    .upload(uploadParams)
    .promise()
    .catch((e) => ({ error: e }));
  return (uploadRes as aws.S3.ManagedUpload.SendData)
    ? res.status(200).json("Geojson sucessfully uploaded")
    : res.status(500).json("Geojson upload failed.");
});

router.post(
  "/mapbox/upload",
  checkJwt,
  upload.array("gpx"),
  async (req, res) => {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No gpx file found" });
    }
    const file = (req.files as Express.Multer.File[])[0];
    const body = req.body;
    if (!body.id) return res.status(400).json("Route id missing");
    const uploadRes = await createMapboxUpload(body.id, file.buffer).catch(
      (e) => ({ error: e })
    );
    return isError(uploadRes)
      ? res.status(500).json("Could not perform mapbox upload")
      : res.status(200).send("Mapbox upload initiated.");
  }
);

router.get("/mapbox/uploads", async (req, res) => {
  const uploads = await listUploads();
  res.status(200).json(uploads.body);
});

router.delete("/route/:routeId", checkJwt, async (req: any, res: any) => {
  if (!req.params.routeId) return res.status(400).json("Missing route id");
  const params = {
    Bucket: s3Bucket,
    Key: req.params.routeId,
  };
  s3.deleteObject(params, (err: any, data: any) => {
    if (err) res.status(400).json("Could not delete geojson.");
    else res.status(200).json("Geojson deleted.");
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
