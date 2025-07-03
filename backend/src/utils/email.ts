import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"JobQuest" <${process.env.FROM_EMAIL}>`,
    to,
    subject: "Your OTP Code",
    html: `<p>Hello,</p>
           <p>Your OTP code is: <strong>${otp}</strong></p>
           <p>This code is valid for 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};
