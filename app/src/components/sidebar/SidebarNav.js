import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import ReactPerfectScrollbar from "react-perfect-scrollbar";
import { List } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import SidebarNavSection from "./SidebarNavSection";

const baseScrollbar = (props) => css`
  background-color: ${props.theme.sidebar.background};
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  flex-grow: 1;
`;

const Scrollbar = styled.div`
  ${baseScrollbar}
`;

const PerfectScrollbar = styled(ReactPerfectScrollbar)`
  ${baseScrollbar}
`;

const Items = styled.div`
  padding-top: ${(props) => props.theme.spacing(2.5)};
  padding-bottom: ${(props) => props.theme.spacing(2.5)};
`;

const SidebarNav = ({ items }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const ScrollbarComponent = matches ? PerfectScrollbar : Scrollbar;
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetch("/api/count")
      .then((response) => response.json())
      .then((data) => {
        const counts = data.reduce((acc, item) => {
          acc[item.index] = item.count;
          return acc;
        }, {});
        console.log("Count fetched:", counts);
        setCount(counts);
      })
      .catch((error) => {
        console.error("Error fetching count:", error);
      });
  }, []); // The empty array ensures this effect runs only once after the component mounts

  return (
    <ScrollbarComponent>
      <List disablePadding>
        <Items>
          {items &&
            items.map((item) => (
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
