import React, { useRef, useState } from "react";
import Link from "next/link";
import styled from "@emotion/styled";

import {
  Avatar as MuiAvatar,
  Badge,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover as MuiPopover,
  SvgIcon,
  Tooltip,
  Typography,
} from "@mui/material";
import { Bell, Server } from "react-feather";

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

const Avatar = styled(MuiAvatar)`
  background: ${(props) => props.theme.palette.primary.main};
`;

const NotificationHeader = styled(Box)`
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

function Notification({ title, description, Icon }) {
  return (
    <Link href="/">
      <ListItem divider>
        <ListItemAvatar>
          <Avatar>
            <SvgIcon fontSize="small">
              <Icon />
            </SvgIcon>
          </Avatar>
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

function NavbarNotificationsDropdown() {
  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Tooltip title="Notifications">
        <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
          <Indicator badgeContent={1}>
            <Bell />
          </Indicator>
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
        <NotificationHeader p={2}>
          <Typography variant="subtitle1" color="textPrimary">
            1 New Notification
          </Typography>
        </NotificationHeader>
        <React.Fragment>
          <List disablePadding>
            <Notification
              title="A new OpenML is coming!"
              description="Stay tuned for more updates."
              Icon={Server}
            />
          </List>
          <Box p={1} display="flex" justifyContent="center">
            <Button component={Link} href="/" size="small">
              Show all notifications
            </Button>
          </Box>
        </React.Fragment>
      </Popover>
    </React.Fragment>
  );
}

export default NavbarNotificationsDropdown;
