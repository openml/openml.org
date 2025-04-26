import { styled } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";

const Markdown = styled(ReactMarkdown)`
  margin-bottom: 10px;
  font-size: 12px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; // Limit to 3 lines
  text-overflow: ellipsis;
  white-space: normal; // Override the default 'nowrap'
  word-break: break-word; // To prevent overflow
  max-height: none;

  code {
    background-color: rgba(0, 0, 0, 0.1);
    padding: 2px;
    border-radius: 4px;
    font-size: 12px;
    font-family: "Roboto Mono", monospace;
  }
`;

const Teaser = ({ description, limit }) => {
  if (!description) {
    return null;
  }

  // Regular expression to match numbered list items
  const listRegex = /^(\d+\.\s+|\-\s+)/;

  // Split description into lines, trim them, and filter out headers, bulleted and numbered lists
  let lines = description
    .split("\n")
    .map((line) => line.trim())
    .filter(
      (line) =>
        line &&
        !line.startsWith("#") &&
        !line.startsWith("*") &&
        !listRegex.test(line) &&
        !line.startsWith("```") &&
        !line.startsWith("    "),
    );

  // Take the first limit lines of the filtered content
  if (limit) {
    lines = lines.slice(0, limit).join("\n");
  } else {
    lines = lines.join("\n");
  }

  // Render the Markdown component with the teaser text
  return <Markdown>{lines}</Markdown>;
};

export default Teaser;
