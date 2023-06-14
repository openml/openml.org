import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";

import { Box, Drawer as MuiDrawer, ListItemButton } from "@mui/material";

import Logo from "../../vendor/logo.svg";

import Footer from "./SidebarFooter";
import SidebarNav from "./SidebarNav";

const Drawer = styled(MuiDrawer)`
  border-right: 0;

  > div {
    border-right: 0;
  }
`;

const Brand = styled(ListItemButton)`
  font-size: ${(props) => props.theme.typography.h4.fontSize};
  font-weight: ${(props) => props.theme.typography.fontWeightBold};
  color: ${(props) => props.theme.sidebar.header.color};
  background-color: ${(props) =>
    props.ecolor ? props.ecolor : props.theme.sidebar.header.background};
  font-family: ${(props) => props.theme.typography.fontFamily};
  min-height: 56px;
  padding-left: ${(props) => props.theme.spacing(10)};
  padding-right: ${(props) => props.theme.spacing(6)};
  /*justify-content: center;*/
  cursor: pointer;
  flex-grow: 0;

  ${(props) => props.theme.breakpoints.up("sm")} {
    min-height: 64px;
  }

  &:hover {
    background-color: ${(props) =>
      props.ecolor ? props.ecolor : props.theme.sidebar.header.background};
  }
`;

const BrandIcon = styled(Logo)`
  color: ${(props) => props.theme.sidebar.header.brand.color};
  fill: ${(props) => props.theme.sidebar.header.brand.color};
  margin-left: -26px;
  width: 36px;
  height: 36px;
`;

const Sidebar = ({ items, ecolor, showFooter = true, ...rest }) => {
  return (
    <Drawer variant="permanent" {...rest}>
      <Link href="/" style={{ textDecoration: "none" }}>
        <Brand ecolor={ecolor}>
          <BrandIcon /> <Box ml={1}>OpenML</Box>
        </Brand>
      </Link>
      <SidebarNav items={items} />
      {!!showFooter && <Footer />}
    </Drawer>
  );
};

export default Sidebar;
