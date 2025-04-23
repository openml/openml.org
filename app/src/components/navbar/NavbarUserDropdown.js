import React from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/router";

import {
  Tooltip,
  Menu,
  MenuItem,
  IconButton as MuiIconButton,
} from "@mui/material";

import useAuth from "../../hooks/useAuth";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "next-i18next";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function NavbarUserDropdown() {
  const [anchorMenu, setAnchorMenu] = React.useState(null);
  const router = useRouter();
  const { signOut } = useAuth();

  const toggleMenu = (event) => {
    setAnchorMenu(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorMenu(null);
  };

  const openProfile = async () => {
    router.push("/auth/profile");
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/auth/sign-in");
  };

  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <React.Fragment>
      <Tooltip title={t("tooltips.account")}>
        <IconButton
          aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
          aria-haspopup="true"
          onClick={toggleMenu}
          color="inherit"
          size="large"
        >
          <FontAwesomeIcon icon={faCircleUser} />
        </IconButton>
      </Tooltip>
      <Menu
        id="menu-appbar"
        anchorEl={anchorMenu}
        open={Boolean(anchorMenu)}
        onClose={closeMenu}
      >
        <MenuItem onClick={openProfile}>{t("account.profile")}</MenuItem>
        <MenuItem onClick={handleSignOut}>{t("account.sign_out")}</MenuItem>
      </Menu>
    </React.Fragment>
  );
}

export default NavbarUserDropdown;
