export const baseLayout = (content: string, logoUrl: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenML Email</title>
  <style>
    /* Global link hover */
    a:hover {
    text-decoration: underline!important;
        }
    
    /* CTA Button class for hover states */
    .cta-button {
      background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899) !important;
      color: #ffffff !important;
      text-decoration: none !important;
      font-weight: 600 !important;
      display: inline-block !important;
      padding: 14px 30px !important;
      border-radius: 6px !important;
      box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2) !important;
    }
    .cta-button:hover {
    background: rgba(37, 99, 235, 0.2) !important;
    color: #ffffff !important;
      opacity: 0.9 !important;
      box-shadow: 0 6px 8px rgba(37, 99, 235, 0.3) !important;
      transform: translateY(-1px);
    }
  </style>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f3f4f6; margin: 0; padding: 20px;">
  <div style="max-width: 670px margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background: rgba(37, 99, 235, 0.2); background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); padding: 40px 20px; text-align: center;">
      <img src="${logoUrl}" alt="OpenML Logo" style="max-width: 300px; height: auto; margin: 0px auto;" />
    </div>

    <!-- Main Content -->
    <div style="padding: 25px; background:transparent;">
      ${content}
      
      <!-- Support Info -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
          Need help? Contact us at <a href="mailto:openmachinelearning@gmail.com" style="color: #233044; text-decoration: none;">openmachinelearning@gmail.com</a>
        </p>
        <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 5px;">Best regards,</p>
        <p style="color: #233044; font-size: 15px; font-weight: 600; margin: 0;">The OpenML Team</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #233044; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #e5e7eb; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} OpenML. Open Machine Learning Platform.</p>
    </div>
    
  </div>
</body>
</html>
`;
