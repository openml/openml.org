import styled from "@emotion/styled";
import { Chip } from "@mui/material";
import { useRouter } from "next/router";

const TagChip = styled(Chip)`
  margin-bottom: 5px;
  margin-left: 5px;
`;

export const Tag = (tag) => {
  const router = useRouter();

  const updateTag = (value) => {
    // Create a new URLSearchParams object with the new tag value
    const newUrlParams = new URLSearchParams();
    newUrlParams.set("tags.tag", value);

    // Update the URL to '/d/search' with the new query parameters
    router.push({
      pathname: "/d/search",
      query: Object.fromEntries(newUrlParams),
    });
  };

  if (tag.tag && !tag.tag.toString().startsWith("study")) {
    return (
      <TagChip
        key={"tag_" + tag.tag}
        label={"  " + tag.tag + "  "}
        size="small"
        onClick={() => updateTag(tag.tag)}
      />
    );
  }
  return null;
};
