import { collections as db } from "../database/databaseSetup"

export const resolveUser = async (sub: string) => {
    const user = await db.users.findOne({ sub: sub })
    return user
}

export const updateUser = (user: any) => {
    user.updatedInDbAt = Date.now();
    db.users.updateOne({ sub: user.sub }, { $set: user }, { upsert: true });
};