import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "next-i18next";

function NavbarDocs() {
  const { i18n } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  const handleOpen = () => {
    window.open("https://docs.openml.org", "_blank");
  };

  return (
    <Tooltip title="Documentation">
      <IconButton color="inherit" onClick={handleOpen} size="large">
        <FontAwesomeIcon icon={faBookOpen} />
      </IconButton>
    </Tooltip>
  );
}

export default NavbarDocs;
