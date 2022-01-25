import express from "express";
import { ObjectID } from "mongodb";
import { checkJwt } from "../auth/auth";
import { collections as db } from "../database/databaseSetup";
import { updateUser } from "../services/userService";

import router from "./users";

router.get("/peaks", async (req: any, res) => {
  const peaks = await db.peaks.find({}).sort({ name: 1 }).toArray();
  res.status(200).json(peaks);
});

router.get("/peak-count", async (req, res) => {
  const count = await db.peaks.countDocuments().catch((e) => console.error(e));
  if (!count && count !== 0)
    return res
      .status(500)
      .json({ msg: "Something went wrong when counting peaks." });
  res.status(200).json(count);
});

router.get("/peaks/:searchTerm", async (req: any, res) => {
  const peaks = await db.peaks
    .find({ name: { $regex: req.params.searchTerm, $options: "i" } })
    .limit(5)
    .toArray();
  res.status(200).json(peaks);
});

router.post("/peak", checkJwt, async (req: any, res) => {
  const peak = req.body;
  updateUser(req.user);
  peak.sub = req.user.sub;
  const date = Date.now();
  if (!peak.createdAt) peak.createdAt = date;
  peak.updatedAt = date;
  const { _id, ...props } = peak;
  try {
    const doc = await db.peaks.findOneAndUpdate(
      { _id: new ObjectID(_id) },
      { $set: props },
      { upsert: true, returnOriginal: false }
    );
    res.status(200).json(doc.value);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

export default express.Router();
