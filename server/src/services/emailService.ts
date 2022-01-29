import sendgrid, { MailDataRequired } from "@sendgrid/mail";
import { IComment, ITrip } from "../models/Trip";
import { IUser } from "../models/User";
import { getUser } from "./userService";

const tripDetailsPath = "/trip-details";

sendgrid.setApiKey(process.env.SG_KEY || "");

export const sendEmail = async (msg: MailDataRequired) => {
  sendgrid.send(msg).catch((e) => console.error(e));
};

export const sendCommentNotification = async (trip: ITrip, commentedBy: IUser, comment: IComment) => {
  if (!trip.sub || trip.sub === commentedBy.sub) return;
  const activityOwner = await getUser(trip.sub);
  if (activityOwner?.email) {
    sendEmail({
      from: {
        name: "BackcountryBook",
        email: "contact@pureokrs.com",
      },
      to: activityOwner.email,
      subject: "BackcountryBook - Your activity got a comment",
      text: `
        ${commentedBy.name} commented "${comment.text}" on your BackcountryBook activity "${trip.name}".

        View the activity at https://www.backcountrybook.com${tripDetailsPath}?tripId=${trip._id}

        Best regards,
        The BCBook Team
        `,
      html: `
        <h5>${commentedBy.name} commented "${comment.text}" on your BackcountryBook activity "${trip.name}"</h5>
        <p>View the activity <a href='https://www.backcountrybook.com${tripDetailsPath}?tripId=${trip._id}'>here</a>.</p>
        <br>
        <p>Best regards,</p>
        <p>The BCBook Team</p>
        `,
    });
  }
};
