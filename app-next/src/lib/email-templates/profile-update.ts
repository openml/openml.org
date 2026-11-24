// Email specific components
import { baseLayout } from "./layout";

export const generateProfileUpdateEmail = (
  name: string,
  fields: string[],
  logoUrl: string,
) => {
  const content = `
    <!-- Content for Profile Update -->
    <h1 style="color: #111827; margin: 0 0 20px 0; font-size: 28px; font-weight: 700; text-align: center;">Security Alert: Profile Updated</h1>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${name},</p>
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      This email is to notify you that your OpenML profile was recently updated.
    </p>

    <!-- Changed Fields -->
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <p style="color: #233044; font-size: 14px; font-weight: 600; margin: 0 0 10px 0;">The following items were changed:</p>
      <ul style="color: #374151; font-size: 14px; margin: 0; padding-left: 20px;">
        ${fields.map((field) => `<li>${field}</li>`).join("")}
      </ul>
    </div>
  
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      If you made these changes, you can safely ignore this email.
    </p>

    <!-- Security Warning -->
    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <p style="color: #92400e; font-size: 14px; margin: 0; line-height: 1.6;"><strong>🔒 Was this not you?</strong> Please <a href="https://www.openml.org/auth/reset-password" style="color: #92400e; text-decoration: underline;">reset your password</a> immediately or contact support.</p>
    </div>
  `;

  return baseLayout(content, logoUrl);
};
