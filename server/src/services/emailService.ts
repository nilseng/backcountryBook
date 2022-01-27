import sendgrid, { MailDataRequired } from "@sendgrid/mail";
import { resolveUser } from "./userService";

sendgrid.setApiKey(process.env.SG_KEY || "");

export const sendEmail = async (msg: MailDataRequired) => {
  sendgrid.send(msg).catch((e) => console.error(e));
};

export const sendCommentNotification = (trip: any) => {
  resolveUser(trip.sub).then((user) => {
    if (user?.email)
      sendEmail({
        from: {
          name: "BackcountryBook",
          email: "contact@pureokrs.com",
        },
        to: user.email,
        subject: "BackcountryBook - Your activity got a comment",
        text: `
        Someone commented on your BackcountryBook activity: ${trip.name}!
        Log in and view the comment at https://www.backcountrybook.com

        Best regards,
        The BCBook Team
        `,
      });
  });
};
