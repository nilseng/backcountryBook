import express from "express";

import { collections as db } from "../database/databaseSetup";

const router = express.Router();

router.get("/user/:sub", async (req: any, res: any) => {
  if (!req.params?.sub)
    return res.status(400).json("No sub received by get user endpoint");
  const user = await db.users.findOne({ sub: req.params.sub });
  if (!user)
    return res.status(404).json(`No user with sub ${req.params.sub} found`);
  res.status(200).json(user);
});

router.get("/user-count", async (req, res) => {
  const count = await db.users.countDocuments().catch((e) => console.log(e));
  if (!count && count !== 0)
    return res.status(500).json({ msg: "User count failed." });
  res.status(200).json(count);
});

export default router;
