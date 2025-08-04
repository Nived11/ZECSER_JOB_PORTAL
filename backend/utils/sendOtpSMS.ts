import Nodemailer from "nodemailer"
import env from "dotenv"

env.config();

const transport = Nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS

    }
});

export const sendOtpSMS = async (phone: string, otp: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, 
    subject: `Simulated Phone OTP for ${phone}`,
    text: `Simulated Phone OTP for number ${phone}: ${otp}`,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("Simulated phone OTP email sent");
  } catch (error) {
    console.log("Error sending simulated OTP email:", error);
    throw new Error("Failed to simulate phone OTP");
  }
};