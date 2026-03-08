import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  message: string
) => {
  const { error } = await resend.emails.send({
    from: "Caritas <onboarding@resend.dev>",
    to,
    subject,
    html: message,
  });

  if (error) {
    throw new Error(error.message);
  }
};

// Old nodemailer implementation, switched to Resend for HTTPS-based email sending

// import nodemailer from 'nodemailer';

// const EMAIL_USER = process.env.EMAIL_USER;
// const EMAIL_PASS = process.env.EMAIL_PASS;

// export const sendEmail = async (
//   to: string,
//   subject: string,
//   message: string,
// ) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       host: 'smtp.gmail.com',
//       auth: {
//         user: EMAIL_USER, // your email
//         pass: EMAIL_PASS, // the app password
//       },
//       secure: true,
//       port: 465,
//     });

//     // Send email
//     const info = await transporter.sendMail({
//       from: EMAIL_USER,
//       to,
//       subject,
//       html: message,
//     });

//     console.log('Email sent:', info);
//   } catch (err) {
//     throw err;
//   }
// };
