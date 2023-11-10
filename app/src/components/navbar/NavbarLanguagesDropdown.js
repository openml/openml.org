import React from "react";
import styled from "@emotion/styled";
import { useTranslation } from "next-i18next";

import {
  Tooltip,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
} from "@mui/material";

import { useRouter } from "next/router";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

const Flag = styled.img`
  border-radius: 50%;
  width: 22px;
  height: 22px;
`;

const languageOptions = {
  en: {
    icon: "/static/img/flags/us.png",
    name: "languages.english",
  },
  fr: {
    icon: "/static/img/flags/fr.png",
    name: "languages.french",
  },
  de: {
    icon: "/static/img/flags/de.png",
    name: "languages.german",
  },
  nl: {
    icon: "/static/img/flags/nl.png",
    name: "languages.dutch",
  },
};

function NavbarLanguagesDropdown() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }
  const selectedLanguage = languageOptions[i18n.language];

  const router = useRouter();

  function changeLang(locale) {
    router.push(
      {
        query: router.query,
      },
      router.asPath,
      { locale },
    );
  }

  const [anchorMenu, setAnchorMenu] = React.useState(null);
  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const handleLanguageChange = (language) => {
    changeLang(language);
    closeMenu();
  };

  return (
    <React.Fragment>
      {selectedLanguage && (
        <Tooltip title={t("tooltips.languages")}>
          <IconButton
            aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
            aria-haspopup="true"
            onClick={toggleMenu}
            color="inherit"
            size="large"
          >
            <Flag src={selectedLanguage.icon} alt={selectedLanguage.name} />
          </IconButton>
        </Tooltip>
      )}
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        {Object.keys(languageOptions).map((language) => (
          <MenuItem
            key={language}
            onClick={() => handleLanguageChange(language)}
          >
            {t(languageOptions[language].name)}
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  );
}

export default NavbarLanguagesDropdown;
