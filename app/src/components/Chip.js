import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { IconButton, Chip as MuiChip, Snackbar } from "@mui/material";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
const Chip = styled(MuiChip)`
  padding: 4px 4px;
  margin-right: 16px;
  margin-bottom: 16px;
  font-size: 100%;
`;

const ListIcon = styled(FontAwesomeIcon)`
  margin-left: 10px;
  margin-right: 10px;
  font-weight: 800;
`;

const ContactChip = ({ link, icon, text, target, copytext, copymessage }) => {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (even, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <FontAwesomeIcon icon={faXmark} size="lg" />
      </IconButton>
    </React.Fragment>
  );

  const copyText = (text) => {
    if (text !== undefined) {
      navigator.clipboard.writeText(text);
      setOpen(true);
    }
  };

  return (
    <React.Fragment>
      <Chip
        icon={<ListIcon icon={icon} size="lg" style={{ marginRight: 0 }} />}
        component="a"
        href={link}
        label={text}
        target={target}
        onClick={() => copyText(copytext)}
        clickable
        color="primary"
        //variant="outlined"
      />
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={copymessage}
        action={action}
      />
    </React.Fragment>
  );
};

export default ContactChip;
