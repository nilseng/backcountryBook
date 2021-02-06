import express from "express"

import { collections as db } from "../database/databaseSetup"

const router = express.Router()

router.get("/user/:sub", async (req: any, res: any) => {
    if (!req.params?.sub) return res.status(400).json("No sub received by get user endpoint")
    const user = await db.users.findOne({ sub: req.params.sub })
    if (!user) return res.status(404).json(`No user with sub ${req.params.sub} found`)
    res.status(200).json(user)
})

export default router