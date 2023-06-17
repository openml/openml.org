import React, { useRef, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material/styles";

import {
  Badge,
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
import {
  faCirclePlus,
  faCircleUser,
  faMagicWandSparkles,
} from "@fortawesome/free-solid-svg-icons";

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

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${(props) => props.theme.header.indicator.background};
    color: ${(props) => props.theme.palette.common.white};
  }
`;

const MessageHeader = styled(Box)`
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
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

  return (
    <React.Fragment>
      <Tooltip title="Create">
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
            Create and share
          </Typography>
        </MessageHeader>
        <React.Fragment>
          <List disablePadding>
            <Message
              title="New dataset"
              description="Share a new dataset."
              icon={theme.palette.icon.data}
              color={theme.palette.entity.data}
            />
            <Message
              title="New task"
              description="Set a new challenge for the community."
              icon={theme.palette.icon.task}
              color={theme.palette.entity.task}
            />
            <Message
              title="New collection"
              description="Organize your resources."
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
