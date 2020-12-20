import express from "express"

import { collections as db } from "../database/databaseSetup"

const router = express.Router()

export const resolveUser = async (sub: string) => {
    const user = await db.users.findOne({ sub: sub })
    return user
}

export default router