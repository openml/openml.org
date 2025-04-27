import { styled } from "@mui/material/styles";
import ReactMarkdown from "react-markdown";

const MarkdownWrapper = styled("div")(({ theme }) => ({
  marginBottom: "10px",
  fontSize: "12px",
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2, // Limit to 2 lines
  textOverflow: "ellipsis",
  whiteSpace: "normal",
  wordBreak: "break-word",
  maxHeight: "none",
  "& code": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    padding: "2px",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: "'Roboto Mono', monospace",
  },
}));

const Markdown = ({ children, ...props }) => {
  return (
    <MarkdownWrapper>
      <ReactMarkdown {...props}>{children}</ReactMarkdown>
    </MarkdownWrapper>
  );
};

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
