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

export const sendOtpEmail = async (email: string, otp: string) => {
    const mailOptions={
        from:process.env.EMAIL_USER,
        to:email,
        subject:"your OTP Code",
        text:`Your OTP Code is :${otp}`
    }
    try {
        await transport.sendMail(mailOptions);
        console.log("OTP email sent successfully");
        
        
    } catch (error) {
        console.log("error sending OTP email :",error);
        throw new Error("Failed to send OTP Email")
        
    }
}