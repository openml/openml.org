import nodemailer from "nodemailer";

/**
 * Shared email utility for sending system emails
 */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_SERVER || "localhost",
  port: parseInt(process.env.SMTP_PORT || "1025"),
  auth: {
    user: process.env.SMTP_LOGIN,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send account confirmation email
 */
export async function sendConfirmationEmail(email: string, token: string) {
  const server = process.env.EMAIL_SERVER || "localhost:3050";
  const link = `https://${server}/auth/confirm-page/?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_SENDER || '"OpenML" <noreply@openml.org>',
    to: email,
    subject: "Welcome to OpenML!",
    text: `Hi,

Thank you for signing up to OpenML.
To verify your email address, please click ${link}
    
If that doesn't work, try copy-pasting it in your browser.
If you run into any issues, please contact us at openmachinelearning@gmail.com

Have a great day, 
The OpenML team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return { success: false, error };
  }
}
