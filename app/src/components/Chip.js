import React from "react";
import styled from "@emotion/styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Chip as MuiChip } from "@mui/material";

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

const ContactChip = ({ link, icon, text, target }) => {
  return (
    <Chip
      icon={<ListIcon icon={icon} size="lg" style={{ marginRight: 0 }} />}
      component="a"
      href={link}
      label={text}
      target={target}
      clickable
      color="primary"
      //variant="outlined"
    />
  );
};

export default ContactChip;
