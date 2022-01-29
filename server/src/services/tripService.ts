import { getUser } from "./userService";
import { collections as db } from "../database/databaseSetup";
import { ITrip } from "../models/Trip";
import { ObjectID } from "mongodb";

export const resolveCommentUsers = async (trip: any) => {
  if (trip.comments) {
    trip.comments = await Promise.all(
      trip.comments.map(async (c: any) => {
        const user = await getUser(c.sub);
        return { ...c, user };
      })
    );
  }
};

export const getTrip = async (_id: string): Promise<ITrip | undefined> => {
  const trip: ITrip = await db.trips
    .findOne({ _id: new ObjectID(_id) })
    .catch((e) => console.error("Finding trip failed."));
  if (trip.sub) trip.user = await getUser(trip.sub);
  return trip;
};
