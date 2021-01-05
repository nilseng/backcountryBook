import { ObjectID } from "mongodb"
import { collections as db } from "../database/databaseSetup"

export const resolvePeaks = async (peakIds: string[]) => {
    const peaks = await db.peaks.find({ _id: { $in: peakIds.map(id => new ObjectID(id)) } }).toArray()
    return peaks
}