import { resolveUser } from "./userService";

export const resolveCommentUsers = async (trip: any) => {
  if (trip.comments)
    trip.comments = await Promise.all(
      trip.comments.map(async (c: any) => {
        const user = await resolveUser(c.sub);
        return { ...c, user };
      })
    );
};
