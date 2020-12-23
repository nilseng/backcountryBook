import express from "express"
import { ObjectID } from "mongodb"
import { checkJwt } from "../auth/auth"

import { collections as db } from "../database/databaseSetup"
import { updateUser } from "../services/userService"
import { resolveUser } from "./users"

const router = express.Router()

router.get("/trips", async (req: any, res) => {
    const trips = await db.trips.find({}).sort({ createdAt: -1 }).toArray()
    for (let trip of trips) {
        trip.user = await resolveUser(trip.sub)
    }
    res.status(200).json(trips)
})

router.post("/trip", checkJwt, async (req: any, res) => {
    const trip = req.body
    updateUser(req.user)
    trip.sub = req.user.sub
    const date = Date.now()
    if (!trip.createdAt) trip.createdAt = date
    trip.updatedAt = date
    const { _id, ...props } = trip
    try {
        const doc = await db.trips.findOneAndUpdate({ _id: new ObjectID(_id) }, { $set: props }, { upsert: true, returnOriginal: false })
        res.status(200).json(doc.value)
    } catch (e) {
        res.status(400).json({ error: e })
    }
})

export default router