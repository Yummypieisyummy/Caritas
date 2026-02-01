import nodemailer from 'nodemailer';

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

export const sendEmail = async (
  to: string,
  subject: string,
  message: string,
) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: EMAIL_USER, // your email
        pass: EMAIL_PASS, // the app password
      },
      secure: true,
      port: 465,
    });

    // Send email
    const info = await transporter.sendMail({
      from: EMAIL_USER,
      to,
      subject,
      html: message,
    });

    console.log('Email sent:', info);
  } catch (err) {
    throw err;
  }
};
