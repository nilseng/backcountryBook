import { collections as db } from "../database/databaseSetup"

export const updateUser = (user: any) => {
    user.updatedInDbAt = Date.now();
    db.users.updateOne({ sub: user.sub }, { $set: user }, { upsert: true });
};