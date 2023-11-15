import React, { useRef, useState } from "react";
import NextLink from "next/link";
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
import { useTranslation } from "next-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faRocket } from "@fortawesome/free-solid-svg-icons";

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

const Link = styled(NextLink)`
  text-decoration: none;
`;

function Notification({ title, description, icon }) {
  return (
    <Link href="/">
      <ListItem divider>
        <ListItemAvatar>
          <Avatar>
            <SvgIcon fontSize="small">
              <FontAwesomeIcon icon={icon} />
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

  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <React.Fragment>
      <Tooltip title="Notifications">
        <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
          <Indicator badgeContent={1}>
            <FontAwesomeIcon icon={faBell} />
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
            {t("notifications.new_notifications")}
          </Typography>
        </NotificationHeader>
        <React.Fragment>
          <List disablePadding>
            <Notification
              title="A new OpenML is coming!"
              description="Stay tuned for more updates."
              icon={faRocket}
            />
          </List>
          <Box p={1} display="flex" justifyContent="center">
            <Button component={Link} href="/" size="small">
              {t("notifications.show_all")}
            </Button>
          </Box>
        </React.Fragment>
      </Popover>
    </React.Fragment>
  );
}

export default NavbarNotificationsDropdown;
