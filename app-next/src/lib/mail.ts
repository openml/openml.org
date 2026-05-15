import nodemailer from "nodemailer";
import { APP_CONFIG } from "@/lib/config";
import { generateConfirmEmail } from "./email-templates/confirm-email";
import { generateResetPasswordEmail } from "./email-templates/reset-password";
import { generateProfileUpdateEmail } from "./email-templates/profile-update";
import { generateAdminReviewEmail } from "./email-templates/admin-upload";
import { generateDatasetEditEmail } from "./email-templates/dataset-edit";
import { generateEntityCreatedEmail } from "./email-templates/entity-created";

// Shared email utility for sending system emails
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

// Send account confirmation email
export async function sendConfirmationEmail(email: string, token: string) {
  const baseUrl = APP_CONFIG.siteUrl || "http://localhost:3050";
  const link = `${baseUrl}/auth/confirm-email?token=${token}`;
  const logoUrl = `${baseUrl}/logo_openML_light-bkg.png`;

  const htmlContent = generateConfirmEmail(link, logoUrl);

  const mailOptions = {
    from: process.env.SMTP_FROM || '"OpenML" <noreply@openml.org>',
    to: email,
    subject: "Welcome to OpenML!",
    html: htmlContent,
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

//Send password reset email
export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = APP_CONFIG.siteUrl || "http://localhost:3050";
  const link = `${baseUrl}/auth/reset-password?token=${token}`;
  const logoUrl = `${baseUrl}/logo_openML_light-bkg.png`;

  const htmlContent = generateResetPasswordEmail(link, logoUrl);

  const mailOptions = {
    from: process.env.SMTP_FROM || '"OpenML" <noreply@openml.org>',
    to: email,
    subject: "Reset Your OpenML Password",
    html: htmlContent,
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

// Send profile update notification
export async function sendProfileUpdateEmail(email: string, name: string) {
  const baseUrl = APP_CONFIG.siteUrl || "http://localhost:3000";
  const logoUrl = `${baseUrl}/logo_openML_light-bkg.png`;
  const supportUrl = "mailto:openmachinelearning@gmail.com";

  const htmlContent = generateProfileUpdateEmail(
    name,
    ["Profile Details"],
    logoUrl,
  );

  const mailOptions = {
    from: process.env.SMTP_FROM || '"OpenML" <noreply@openml.org>',
    to: email,
    subject: "Security Alert: Profile Updated",
    html: htmlContent,
    text: `Hi ${name},

Your OpenML profile has been updated.

If you made this change, you can safely ignore this email.
If you did not authorize this change, please contact us immediately at ${supportUrl}.

Best regards,
The OpenML Team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Profile update email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending profile update email:", error);
    return { success: false, error };
  }
}

//Send dataset upload notification to admins
export async function sendDatasetUploadEmail(
  uploaderName: string,
  datasetName: string,
  datasetId: string | number,
) {
  const baseUrl = APP_CONFIG.siteUrl || "http://localhost:3000";
  const datasetUrl = `${baseUrl}/datasets/${datasetId}`;
  const logoUrl = `${baseUrl}/logo_openML_light-bkg.png`;

  const htmlContent = generateAdminReviewEmail(
    uploaderName,
    datasetId.toString(),
    datasetName,
    logoUrl,
    datasetUrl,
  );

  // Send to ADMIN_EMAIL or default support email
  const adminEmail = process.env.ADMIN_EMAIL || "openmachinelearning@gmail.com";

  const mailOptions = {
    from: process.env.SMTP_FROM || '"OpenML" <noreply@openml.org>',
    to: adminEmail,
    subject: `New Dataset Upload: ${datasetName}`,
    html: htmlContent,
    text: `New Dataset Upload

User: ${uploaderName}
Dataset: ${datasetName}
Link: ${datasetUrl}

Please review this dataset to ensure it meets our quality standards.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Dataset upload email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending dataset upload email:", error);
    return { success: false, error };
  }
}

// Send creation confirmation to the creator (dataset, task, or collection)
export async function sendCreationConfirmationEmail(
  recipientEmail: string,
  entityType: "dataset" | "task" | "collection",
  entityName: string,
  entityId: string | number,
) {
  const baseUrl = APP_CONFIG.siteUrl || "http://localhost:3050";
  const logoUrl = `${baseUrl}/logo_openML_light-bkg.png`;
  const pathMap = { dataset: "datasets", task: "tasks", collection: "collections" };
  const entityUrl = `${baseUrl}/${pathMap[entityType]}/${entityId}`;

  const htmlContent = generateEntityCreatedEmail(
    entityType,
    entityName,
    entityId.toString(),
    entityUrl,
    logoUrl,
  );

  const labelMap = { dataset: "Dataset", task: "Task", collection: "Collection" };
  const label = labelMap[entityType];

  const mailOptions = {
    from: process.env.SMTP_FROM || '"OpenML" <noreply@openml.org>',
    to: recipientEmail,
    subject: `Your OpenML ${label} "${entityName}" has been created`,
    html: htmlContent,
    text: `Your ${label} "${entityName}" has been successfully submitted to OpenML.\nView it at: ${entityUrl}\n\nBest regards,\nThe OpenML Team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`${label} creation email sent:`, info.messageId);
    return { success: true };
  } catch (error) {
    console.error(`Error sending ${label} creation email:`, error);
    return { success: false, error };
  }
}

// Send dataset edit notification

export async function sendDatasetEditEmail(
  recipientEmail: string,
  datasetName: string,
  datasetId: string | number,
) {
  const baseUrl = APP_CONFIG.siteUrl || "http://localhost:3000";
  const datasetUrl = `${baseUrl}/datasets/${datasetId}`;
  const logoUrl = `${baseUrl}/logo_openML_light-bkg.png`;

  const htmlContent = generateDatasetEditEmail(
    "User",
    datasetId.toString(),
    datasetName,
    ["Metadata updated"], // changes
    logoUrl,
    datasetUrl,
  );

  const mailOptions = {
    from: process.env.SMTP_FROM || '"OpenML" <noreply@openml.org>',
    to: recipientEmail,
    subject: `Update: Dataset "${datasetName}" has been modified`,
    html: htmlContent,
    text: `Dataset Update

The dataset "${datasetName}" has been updated.
View the changes here: ${datasetUrl}

Best regards,
The OpenML Team`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Dataset edit email sent:", info.messageId);
    return { success: true };
  } catch (error) {
    console.error("Error sending dataset edit email:", error);
    return { success: false, error };
  }
}
