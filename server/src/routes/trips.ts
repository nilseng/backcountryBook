import express from "express"
import { ObjectId, ObjectID } from "mongodb"
import { checkJwt } from "../auth/auth"

import { collections as db } from "../database/databaseSetup"
import { deleteImage } from "../services/imageService"
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

router.delete("/trip", checkJwt, async (req: any, res) => {
    if (!req.body?._id) return res.status(400).json({ Error: 'No trip _id received by server.' })
    if (!req.user.sub === req.body.sub) return res.status(401).json({ Error: 'Unauthorized' })
    if (req.body.imageIds) {
        for (const id of req.body.imageIds) {
            deleteImage(id)
        }
    }
    const doc = await db.trips.deleteOne({ _id: new ObjectId(req.body._id) })
    res.status(200).json(doc)
})

export default router