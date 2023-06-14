import React from "react";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NextLink from "next/link";

import Chip from "../components/Chip";

import {
  Button,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardActions as MuiCardActions,
  CardMedia as MuiCardMedia,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography as MuiTypography,
} from "@mui/material";

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)``;
const CardActions = styled(MuiCardActions)`
  padding-left: 15px;
`;

const CardMedia = styled(MuiCardMedia)`
  height: 220px;
`;

const ListIcon = styled(FontAwesomeIcon)`
  margin-left: 10;
  margin-right: 10;
`;

const CardItem = ({ link, icon, color, text }) => {
  return (
    <ListItemButton href={link}>
      <ListItemIcon>
        <ListIcon icon={icon} size="2x" style={{ color: color }} />
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </ListItemButton>
  );
};

const TitleIcon = styled(FontAwesomeIcon)`
  padding-right: 15px;
`;

const Typography = styled(MuiTypography)(spacing);

const ButtonImage = styled.img`
  height: 40px;
  width: auto;
  transition: 0.15s ease-in-out;
  padding-right: 15px;
  border-radius: 4px;

  &:hover {
    transform: scale(1.0325);
  }
`;

const InfoCard = ({ info }) => {
  return (
    <Card style={{ width: "100%" }}>
      {info.media && <CardMedia image={info.media} />}
      <CardContent>
        <Typography
          sx={{ pb: 4, pt: 3 }}
          variant="h5"
          align={info.icon ? "left" : "center"}
        >
          {info.icon && (
            <TitleIcon icon={info.icon} size="lg" color={info.iconColor} />
          )}
          {info.title}
        </Typography>
        <Typography>{info.text}</Typography>
      </CardContent>
      <CardActions>
        <List component="nav">
          {info.items?.map((item) => (
            <CardItem
              key={item.text}
              link={item.link}
              icon={item.icon}
              color={item.color}
              text={item.text}
              target={item.target}
            />
          ))}
          {info.widgets?.map((widget) => (
            <NextLink key={widget.alt} href={widget.link} passHref>
              <ButtonImage src={widget.button} width="265" alt={widget.alt} />
            </NextLink>
          ))}
          {info.chips?.map((chip) => (
            <Chip
              key={chip.link + chip.text}
              link={chip.link}
              icon={chip.icon}
              text={chip.text}
              target={chip.target}
            />
          ))}
          {info.buttons?.map((button) => (
            <Button
              key={button.href}
              size="small"
              color="primary"
              href={button.href}
              style={{ marginRight: 16 }}
            >
              {button.text}
            </Button>
          ))}
        </List>
      </CardActions>
    </Card>
  );
};

export default InfoCard;
