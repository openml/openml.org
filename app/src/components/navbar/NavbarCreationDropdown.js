import React, { useRef, useState } from "react";
import NextLink from "next/link";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material/styles";

import {
  Box,
  IconButton as MuiIconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover as MuiPopover,
  Tooltip,
  Typography,
} from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "next-i18next";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Popover = styled(MuiPopover)`
  .MuiPaper-root {
    width: 300px;
    ${(props) => props.theme.shadows[1]};
    border: 1px solid ${(props) => props.theme.palette.divider};
  }
`;

const MessageHeader = styled(Box)`
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

const Link = styled(NextLink)`
  text-decoration: none;
`;

function Message({ title, description, icon, color }) {
  return (
    <Link href="/">
      <ListItem divider>
        <ListItemAvatar>
          <FontAwesomeIcon icon={icon} size="2x" color={color} />
        </ListItemAvatar>
        <ListItemText
          primary={title}
          primaryTypographyProps={{
            variant: "subtitle2",
            color: "textPrimary",
          }}
          secondary={description}
        />
      </ListItem>
    </Link>
  );
}

function NavbarCreationDropdown() {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const theme = useTheme();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <React.Fragment>
      <Tooltip title={t("tooltips.create")}>
        <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
          <FontAwesomeIcon icon={faMagicWandSparkles} />
        </IconButton>
      </Tooltip>
      <Popover
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
      >
        <MessageHeader p={2}>
          <Typography variant="subtitle1" color="textPrimary">
            {t("create.title")}
          </Typography>
        </MessageHeader>
        <React.Fragment>
          <List disablePadding>
            <Message
              title={t("create.new_data")}
              description={t("create.new_data_text")}
              icon={theme.palette.icon.data}
              color={theme.palette.entity.data}
            />
            <Message
              title={t("create.new_task")}
              description={t("create.new_task_text")}
              icon={theme.palette.icon.task}
              color={theme.palette.entity.task}
            />
            <Message
              title={t("create.new_collection")}
              description={t("create.new_collection_text")}
              icon={theme.palette.icon.collections}
              color={theme.palette.entity.collections}
            />
          </List>
        </React.Fragment>
      </Popover>
    </React.Fragment>
  );
}

export default NavbarCreationDropdown;
