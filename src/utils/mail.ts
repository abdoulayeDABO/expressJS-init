import nodemailer from "nodemailer";

export const sendEmail = async ({receiverEmail, subject, body} : {receiverEmail: string[], subject: string, body: string}) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SMTP_HOST ?? 'smt.gmail.com',
        port: parseInt(process.env.EMAIL_SMTP_PORT ?? '587'),
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_SMTP_USERNAME,
          pass: process.env.EMAIL_SMTP_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.EMAIL_SMTP_USERNAME,
        to: receiverEmail,
        subject: subject,
        html: body,
    }

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) throw new Error(`Failed to send email to ${receiverEmail}`);
    });
}
