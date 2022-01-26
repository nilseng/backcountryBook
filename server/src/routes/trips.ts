import express from "express";
import { ObjectID } from "mongodb";
import url from "url";
import { checkJwt } from "../auth/auth";

import { collections as db } from "../database/databaseSetup";
import { deleteImage } from "../services/imageService";
import { resolvePeaks } from "../services/peakService";
import { resolveCommentUsers } from "../services/tripService";
import { resolveUser, updateUser } from "../services/userService";
import { isError } from "../utils/errorHandling";

const router = express.Router();

interface Query {
  limit?: number;
  offset?: number;
  userId?: string;
  count?: boolean;
}

const defaultLimit = 1000000;

router.get("/trips", async (req: any, res) => {
  const query: Query = url.parse(req.url, true).query;
  if (query.count) {
    const count = await db.trips
      .find(query.userId ? { sub: query.userId } : {})
      .count()
      .catch((e) => ({ error: e }));
    return isError(count) ? res.status(500).json(NaN) : res.status(200).json(count);
  }
  const trips = await db.trips
    .find(query.userId ? { sub: query.userId } : {})
    .sort({ tripDate: -1, createdAt: -1 })
    .limit(query.limit ? +query.limit : defaultLimit)
    .skip(query.offset ? +query.offset : 0)
    .toArray()
    .catch((e) => console.error(e));
  if (!trips) return res.status(500).json([]);
  for (let trip of trips) {
    trip.user = await resolveUser(trip.sub);
    if (trip.peakIds) trip.peaks = await resolvePeaks(trip.peakIds);
    await resolveCommentUsers(trip);
  }
  res.status(200).json(trips);
});

router.post("/trip", checkJwt, async (req: any, res) => {
  const trip = req.body;
  updateUser(req.user);
  trip.sub = req.user.sub;
  const date = Date.now();
  if (!trip.createdAt) trip.createdAt = date;
  trip.updatedAt = date;
  if (!trip.tripDate) trip.tripDate = date;
  const { _id, ...props } = trip;
  try {
    const doc = await db.trips.findOneAndUpdate(
      { _id: new ObjectID(_id) },
      { $set: props },
      { upsert: true, returnOriginal: false }
    );
    res.status(200).json(doc.value);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});

router.post("/trip/like", checkJwt, async (req: any, res) => {
  const { tripId, likes } = req.body;
  const sub = req.user.sub;
  if (!tripId || (!likes && likes !== 0)) return res.status(400).json("Invalid body.");
  const doc = await db.trips
    .findOneAndUpdate({ _id: new ObjectID(tripId) }, { $inc: { likes }, $addToSet: { likedByUsers: sub } })
    .catch((e) => ({ error: e }));
  return isError(doc) ? res.status(500).json("Something went wrong:(") : res.status(200).send();
});

router.post("/trip/comment", checkJwt, async (req: any, res) => {
  let { tripId, comment } = req.body;
  if (!tripId || !comment) return res.status(400).json("Invalid body");
  const sub = req.user.sub;
  comment.sub = sub;
  comment.createdAt = Date.now();
  const doc = await db.trips
    .findOneAndUpdate({ _id: new ObjectID(tripId) }, { $addToSet: { comments: comment } }, { returnOriginal: false })
    .catch((e) => console.error(e));
  if (!doc) return res.status(500).json("Something went wrong:(");
  try {
    await resolveCommentUsers(doc.value);
  } catch (e) {
    console.error("Something went wrong when resolving comment users", e);
  }
  res.status(200).json(doc.value);
});

router.delete("/trip", checkJwt, async (req: any, res) => {
  if (!req.body?._id) return res.status(400).json({ Error: "No trip _id received by server." });
  if (!req.user.sub === req.body.sub) return res.status(401).json({ Error: "Unauthorized" });
  if (req.body.imageIds) {
    for (const id of req.body.imageIds) {
      deleteImage(id);
    }
  }
  const doc = await db.trips.deleteOne({ _id: new ObjectID(req.body._id) });
  res.status(200).json(doc);
});

export default router;
