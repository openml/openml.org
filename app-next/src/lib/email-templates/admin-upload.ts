// Email specific components
import { baseLayout } from "./layout";

export const generateAdminReviewEmail = (
  userName: string,
  datasetId: string,
  datasetName: string,
  logoUrl: string,
  datasetUrl?: string,
) => {
  const datasetLink = datasetUrl ?? `https://www.openml.org/datasets/${datasetId}`;

  const content = `
    <!-- Content for Admin Upload Review -->
    <h1 style="color: #4338ca; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; text-align: center;">New Dataset Uploaded</h1>
    
    <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h2 style="font-size: 18px; color: #1f2937; margin: 0 0 10px 0;">Upload Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 100px;">User:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 500;">${userName}</td>
            </tr>
             <tr>
                <td style="padding: 8px 0; color: #6b7280;">Dataset:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 500;">${datasetName} (ID: ${datasetId})</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6b7280;">Time:</td>
                <td style="padding: 8px 0; color: #111827;">${new Date().toLocaleString()}</td>
            </tr>
        </table>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 20px 0;">
             <a href="${datasetLink}" class="cta-button" style="background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px;">Review Dataset</a>
        </div>
    </div>

    <p style="color: #6b7280; font-size: 14px; margin-top: 20px; text-align: center;">
      This is an automated notification for OpenML Admins.
    </p>
  `;

  return baseLayout(content, logoUrl);
};
