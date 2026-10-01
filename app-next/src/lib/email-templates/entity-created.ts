import { baseLayout } from "./layout";

type EntityType = "dataset" | "task" | "collection";

const ENTITY_LABELS: Record<EntityType, string> = {
  dataset: "Dataset",
  task: "Task",
  collection: "Collection",
};

export const generateEntityCreatedEmail = (
  entityType: EntityType,
  entityName: string,
  entityId: string,
  entityUrl: string,
  logoUrl: string,
) => {
  const label = ENTITY_LABELS[entityType];

  const content = `
    <h1 style="color: #4338ca; margin: 0 0 20px 0; font-size: 24px; font-weight: 700; text-align: center;">${label} Created Successfully</h1>

    <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h2 style="font-size: 18px; color: #1f2937; margin: 0 0 10px 0;">${label} Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 100px;">${label}:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 500;">${entityName}</td>
            </tr>
            <tr>
                <td style="padding: 8px 0; color: #6b7280;">ID:</td>
                <td style="padding: 8px 0; color: #111827; font-weight: 500;">${entityId}</td>
            </tr>
        </table>

        <p style="color: #374151; font-size: 14px; margin: 0 0 20px 0;">
          Your ${label.toLowerCase()} has been submitted to OpenML and will be available shortly.
        </p>

        <div style="text-align: center; margin: 20px 0;">
          <a href="${entityUrl}" class="cta-button" style="background: linear-gradient(135deg, #6366f1, #8b5cf6, #ec4899); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 14px;">View ${label}</a>
        </div>
    </div>

    <p style="color: #6b7280; font-size: 14px; margin-top: 20px; text-align: center;">
      This is an automated confirmation from OpenML.
    </p>
  `;

  return baseLayout(content, logoUrl);
};
