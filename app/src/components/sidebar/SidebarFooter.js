import React, { useState } from "react";
import { styled, darken } from "@mui/material/styles";
import { rgba } from "polished";
import { Grid, ListItemButton, ListItemText } from "@mui/material";
import { Settings as SettingsIcon } from "@mui/icons-material";
import Settings from "../Settings";
import { useTranslation } from "next-i18next";


const Footer = styled('div')(({ theme }) => ({
  backgroundColor: `${theme.palette.sidebar.footer.background} !important`,
  padding: 0,
  borderRight: '1px solid rgba(0, 0, 0, 0.12)'
}));

const Item = styled(ListItemButton)(({ theme }) => ({
  marginTop: theme.spacing(2),
  paddingTop: theme.spacing(4.75),
  paddingBottom: theme.spacing(5.75),
  paddingLeft: theme.spacing(10),
  paddingRight: theme.spacing(11),
  fontWeight: theme.typography.fontWeightRegular,
  svg: {
    color: theme.palette.sidebar.color,
    fontSize: 20,
    width: 20,
    height: 20,
    opacity: 0.5,
  },
  '&:hover': {
    backgroundColor: darken(theme.palette.sidebar.footer.background, 0.03),
  },
}));

const Title = styled(ListItemText)`
  margin: 0;
  span {
    color: ${(props) => rgba(props.theme.palette.sidebar.color, 1)};
    font-size: ${(props) => props.theme.typography.body1.fontSize}px;
    padding: 0 ${(props) => props.theme.spacing(4)};
  }
`;

function SidebarFooter() {
  const [state, setState] = useState({
    isOpen: false,
  });

  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  const toggleDrawer = (open) => () => {
    setState({ ...state, isOpen: open });
  };

  return (
    <Footer>
      <Settings open={state.isOpen} onClose={toggleDrawer(false)} />
      <Grid container spacing={2}>
        <Item onClick={toggleDrawer(true)}>
          <SettingsIcon />
          <Title>{t("sidebar.settings")}</Title>
        </Item>
      </Grid>
    </Footer>
  );
}

export default SidebarFooter;
