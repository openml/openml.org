import React from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "next-i18next";
import { styled } from "@mui/material/styles";
import { spacing } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NextLink from "next/link";

import {
  Button,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardActions as MuiCardActions,
  CardMedia as MuiCardMedia,
  List as MuiList,
  ListItemButton,
  ListItemIcon,
  ListItemText as MuiListItemText,
  Typography as MuiTypography,
  useMediaQuery,
  IconButton,
  Chip as MuiChip,
  Snackbar,
} from "@mui/material";

import { faXmark } from "@fortawesome/free-solid-svg-icons";

const Card = styled(MuiCard)`
  ${spacing};
  position: relative;
  box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.05);
  flex-direction: column;
  &:after {
    content: " ";
    position: absolute;
    right: ${(props) => (props.arrow == "right" ? "-15px" : "50%")};
    top: ${(props) => (props.arrow == "right" ? "40%" : "inherit")};
    border-top: 15px solid
      ${(props) =>
        props.arrow == "right"
          ? "transparent"
          : props.theme.palette.background.paper};
    border-right: ${(props) =>
      props.arrow == "right" ? "none" : "15px solid transparent"};
    border-left: 15px solid
      ${(props) =>
        props.arrow == "right"
          ? props.theme.palette.background.paper
          : "transparent"};
    border-bottom: ${(props) =>
      props.arrow == "right" ? "15px solid transparent" : "none"};
  }
`;

const CardContent = styled(MuiCardContent)`
  margin-bottom: auto;
`;
const CardActions = styled(MuiCardActions)`
  padding-left: 15px;
  padding-top: 0px;
`;
const CardMedia = styled(MuiCardMedia)`
  height: 220px;
`;
const List = styled(MuiList)`
  padding-top: 0px;
`;
const ListItemText = styled(MuiListItemText)`
  margin: 0px;
`;

const MarkdownWrapper = styled("div")(({ theme }) => ({
  marginBlockStart: "-0.5em",
  marginBlockEnd: "-0.5em",
}));

const Markdown = ({ children, ...props }) => {
  return (
    <MarkdownWrapper>
      <ReactMarkdown {...props}>{children}</ReactMarkdown>
    </MarkdownWrapper>
  );
};

const ListIcon = styled(FontAwesomeIcon)`
  margin-left: 10;
  margin-right: 10;
`;

const TitleIcon = styled(FontAwesomeIcon)`
  padding-right: 15px;
`;

const Typography = styled(MuiTypography)(spacing);

const ButtonImage = styled("img")(({ theme }) => ({
  height: 40,
  width: "auto",
  transition: "0.15s ease-in-out",
  paddingRight: 15,
  borderRadius: 4,
  "&:hover": {
    transform: "scale(1.0325)",
  },
}));

const Chip = styled(MuiChip)`
  padding: 4px 4px;
  margin-right: 16px;
  margin-bottom: 16px;
  font-size: 100%;
`;

const CardItem = ({ link, icon, color, text }) => {
  return (
    <ListItemButton href={link}>
      <ListItemIcon>
        <ListIcon icon={icon} size="2x" style={{ color: color }} />
      </ListItemIcon>
      <ListItemText>
        <Markdown>{text}</Markdown>
      </ListItemText>
    </ListItemButton>
  );
};

export const ActionChip = ({
  link,
  icon,
  text,
  target,
  copytext,
  copymessage,
}) => {
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
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <FontAwesomeIcon icon={faXmark} size="lg" />
      </IconButton>
    </>
  );

  const copyText = (text) => {
    if (text !== undefined) {
      navigator.clipboard.writeText(text);
      setOpen(true);
    }
  };

  return (
    <>
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
    </>
  );
};

const InfoCard = ({ info }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card
      arrow={useMediaQuery(theme.breakpoints.up("md")) ? info.arrow : "bottom"}
      style={{
        width: "100%",
        overflow: info.arrow ? "visible" : "hidden",
      }}
    >
      {info.media && <CardMedia image={info.media} />}
      <CardContent>
        <Typography
          sx={{ pb: 4, pt: 3 }}
          variant="h5"
          align={info.icon ? "left" : "center"}
          style={{ display: "flex" }}
        >
          {info.icon && (
            <TitleIcon icon={info.icon} size="lg" color={info.iconColor} />
          )}
          {t(`${info.id}.title`)}
        </Typography>
        <Markdown>{t(`${info.id}.text`)}</Markdown>
      </CardContent>
      <CardActions>
        <List component="nav">
          {info.items?.map((item, i) => (
            <CardItem
              key={t(`${info.id}.items.${i}`)}
              link={item.link}
              icon={item.icon}
              color={item.color}
              text={t(`${info.id}.items.${i}`)}
              target={item.target}
            />
          ))}
          {info.widgets?.map((widget, i) => (
            <NextLink
              key={t(`${info.id}.widgets.${i}`)}
              href={widget.link}
              passHref
            >
              <ButtonImage
                src={widget.button}
                width="265"
                alt={t(`${info.id}.widgets.${i}`)}
              />
            </NextLink>
          ))}
          {info.chips?.map((chip, i) => (
            <ActionChip
              key={chip.link + t(`${info.id}.chips.${i}`)}
              link={chip.link}
              icon={chip.icon}
              text={t(`${info.id}.chips.${i}`)}
              target={chip.target}
              copytext={chip.text}
              copymessage={t(chip.message)}
            />
          ))}
          {info.buttons?.map((button, i) => (
            <Button
              key={button.href}
              size="small"
              color="primary"
              href={button.href}
              style={{ marginRight: 16 }}
            >
              {t(`${info.id}.buttons.${i}`)}
            </Button>
          ))}
        </List>
      </CardActions>
    </Card>
  );
};

export default InfoCard;
