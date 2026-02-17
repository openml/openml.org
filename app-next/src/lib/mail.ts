import nodemailer from "nodemailer";

/**
 * Shared email utility for sending system emails
 */

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "1025"),
  secure: process.env.SMTP_SECURE === "true",
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        }
      : undefined,
});

/**
 * Send account confirmation email
 */
export async function sendConfirmationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3050";
  const link = `${baseUrl}/auth/confirm-email?token=${token}`;
  const logoUrl = `${baseUrl}/logo_openML_light-bkg.png`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"OpenML" <noreply@openml.org>',
    to: email,
    subject: "Welcome to OpenML!",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header with Logo and Brand Color -->
        <div style="background-color: #233044; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <img src="${logoUrl}" alt="OpenML Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to OpenML!</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px; background-color: #ffffff;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi there,</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Thank you for signing up to OpenML, the collaborative machine learning platform.</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">To verify your email address and activate your account, please click the button below:</p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${link}" style="background-color: #233044; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Confirm Email Address</a>
          </div>

          <!-- Alternative Link -->
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #233044; font-size: 14px; margin: 0 0 10px 0;">Or copy and paste this link into your browser:</p>
            <p style="color: #233044; font-size: 14px; word-break: break-all; margin: 0;">${link}</p>
          </div>

          <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">⏱️ This confirmation link will expire in 24 hours.</p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">If you didn't create an account with OpenML, you can safely ignore this email.</p>

          <!-- Support Info -->
          <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">Need help? Contact us at <a href="mailto:openmachinelearning@gmail.com" style="color: #2563eb; text-decoration: none;">openmachinelearning@gmail.com</a></p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 5px;">Have a great day,</p>
            <p style="color: #2563eb; font-size: 15px; font-weight: 600; margin: 0;">The OpenML Team</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} OpenML. Open Machine Learning Platform.</p>
        </div>
      </div>
    `,
    text: `Hi,

Thank you for signing up to OpenML.
To verify your email address, please visit: ${link}

If that doesn't work, try copy-pasting it in your browser.
This confirmation link will expire in 24 hours.

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

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3050";
  const link = `${baseUrl}/auth/reset-password?token=${token}`;
  const logoUrl = `${baseUrl}/logo_openML_light-bkg.png`;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"OpenML" <noreply@openml.org>',
    to: email,
    subject: "Reset Your OpenML Password",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        <!-- Header with Logo and Brand Color -->
        <div style="background-color: #233044; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <img src="${logoUrl}" alt="OpenML Logo" style="max-width: 200px; height: auto; margin-bottom: 20px;" />
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Reset Your Password</h1>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px; background-color: #ffffff;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi there,</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">We received a request to reset your password for your OpenML account.</p>
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Click the button below to create a new password:</p>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 40px 0;">
            <a href="${link}" style="background-color: #233044; color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Reset Password</a>
          </div>

          <!-- Alternative Link -->
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Or copy and paste this link into your browser:</p>
            <p style="color: #233044; font-size: 14px; word-break: break-all; margin: 0;">${link}</p>
          </div>

          <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">⏱️ This reset link will expire in 1 hour.</p>

          <!-- Security Notice -->
          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
            <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;"><strong>🔒 Security Notice:</strong> If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>

          <!-- Support Info -->
          <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">Need help? Contact us at <a href="mailto:openmachinelearning@gmail.com" style="color: #2563eb; text-decoration: none;">openmachinelearning@gmail.com</a></p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #2563eb; font-size: 15px; font-weight: 600; margin: 0;">The OpenML Team</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} OpenML. Open Machine Learning Platform.</p>
        </div>
      </div>
    `,
    text: `Hi,

We received a request to reset your password for your OpenML account.

To reset your password, please visit: ${link}

If that doesn't work, try copy-pasting it in your browser.
This reset link will expire in 1 hour.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

Need help? Contact us at openmachinelearning@gmail.com

Best regards,
The OpenML Team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return { success: false, error };
  }
}
