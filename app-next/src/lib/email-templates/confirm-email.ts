// Email specific components
import { baseLayout } from "./layout";

export const generateConfirmEmail = (link: string, logoUrl: string) => {
  const content = `
    <!-- Content for Confirm Email -->
    <h1 style="color: #111827; margin: 0 0 20px 0; font-size: 28px; font-weight: 700; text-align: center;">Welcome to OpenML!</h1>
    
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi there,</p>
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Thank you for signing up to OpenML, the collaborative machine learning platform.</p>
    <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">To verify your email address and activate your account, please click the button below:</p>
  
    <!-- CTA Button -->
    <div style="text-align: center; margin: 40px 0;">
      <a href="${link}" class="cta-button" style="background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Confirm Email Address</a>
    </div>
  
    <!-- Alternative Link -->
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Or copy and paste this link into your browser:</p>
      <p style="color: #233044; font-size: 14px; word-break: break-all; margin: 0;">${link}</p>
    </div>
  
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 10px; font-style: italic;">
      ⏱️ This confirmation link will expire in 24 hours.
    </p>
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 30px;">
      If you didn't create an account with OpenML, you can safely ignore this email.
    </p>
  `;

  return baseLayout(content, logoUrl);
};
