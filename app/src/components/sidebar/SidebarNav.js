import React, { useState, useEffect } from "react";
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import { styled, useTheme } from "@mui/material/styles";
import { List } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import SidebarNavSection from "./SidebarNavSection";

const Scrollbar = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.sidebar?.background || theme.palette.background.default || "#FFF",
  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  flexGrow: 1,
}));

const PerfectScrollbarWrapper = styled(ReactPerfectScrollbar)(({ theme }) => ({
  backgroundColor: theme.palette.sidebar?.background || theme.palette.background.default || "#FFF",
  borderRight: '1px solid rgba(0, 0, 0, 0.12)',
  flexGrow: 1,
}));

const Items = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(2.5),
  paddingBottom: theme.spacing(2.5),
}));

const SidebarNav = ({ items }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const ScrollbarComponent = matches ? PerfectScrollbarWrapper : Scrollbar;
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetch("/api/count")
      .then((response) => response.json())
      .then((data) => {
        const counts = data.reduce((acc, item) => {
          acc[item.index] = item.count;
          return acc;
        }, {});
        setCount(counts);
      })
      .catch((error) => {
        console.error("Error fetching count:", error);
      });
  }, []);

  return (
    <ScrollbarComponent>
      <List disablePadding>
        <Items>
          {items?.map((item) => (
            <SidebarNavSection
              component="div"
              key={item.title}
              pages={item.pages}
              title={item.title}
              count={count}
            />
          ))}
        </Items>
      </List>
    </ScrollbarComponent>
  );
};

export default SidebarNav;