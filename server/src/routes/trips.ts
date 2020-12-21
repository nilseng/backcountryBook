import express from "express"

import { collections } from "../database/databaseSetup"
import { resolveUser } from "./users"

const router = express.Router()

router.get("/trips", async (req: any, res) => {
    const trips = await collections.trips.find({}).sort({ createdAt: -1 }).toArray()
    for (let trip of trips) {
        trip.user = await resolveUser(trip.sub)
    }
    res.status(200).json(trips)
})

export default router