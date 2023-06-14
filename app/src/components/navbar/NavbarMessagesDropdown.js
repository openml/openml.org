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
  Tooltip,
  Typography,
} from "@mui/material";
import { MessageSquare } from "react-feather";

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

const MessageHeader = styled(Box)`
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

function Message({ title, description, image }) {
  return (
    <Link href="/">
      <ListItem divider>
        <ListItemAvatar>
          <Avatar src={image} alt="Avatar" />
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

function NavbarMessagesDropdown() {
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
      <Tooltip title="Messages">
        <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
          <Indicator badgeContent={3}>
            <MessageSquare />
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
        <MessageHeader p={2}>
          <Typography variant="subtitle1" color="textPrimary">
            3 New Messages
          </Typography>
        </MessageHeader>
        <React.Fragment>
          <List disablePadding>
            <Message
              title="Lucy Lavender"
              description="Nam pretium turpis et arcu. Duis arcu tortor."
              image="/static/img/avatars/avatar-1.jpg"
            />
            <Message
              title="Remy Sharp"
              description="Curabitur ligula sapien euismod vitae."
              image="/static/img/avatars/avatar-2.jpg"
            />
            <Message
              title="Cassandra Mixon"
              description="Pellentesque auctor neque nec urna."
              image="/static/img/avatars/avatar-3.jpg"
            />
          </List>
          <Box p={1} display="flex" justifyContent="center">
            <Button component={Link} href="/" size="small">
              Show all messages
            </Button>
          </Box>
        </React.Fragment>
      </Popover>
    </React.Fragment>
  );
}

export default NavbarMessagesDropdown;
