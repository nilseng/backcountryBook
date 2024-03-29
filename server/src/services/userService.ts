import { collections as db } from "../database/databaseSetup";

export const getUser = async (sub: string) => {
  const user = await db.users.findOne({ sub: sub }).catch((e) => console.error(`Could not resolve user w sub=${sub}`));
  return user;
};

export const updateUser = (user: any) => {
  user.updatedInDbAt = Date.now();
  db.users.updateOne({ sub: user.sub }, { $set: user }, { upsert: true }).catch((e) => console.error(e));
};
