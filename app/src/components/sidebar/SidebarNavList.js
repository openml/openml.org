import React from "react";

import reduceChildRoutes from "./reduceChildRoutes";

import { useRouter } from "next/router";

const SidebarNavList = (props) => {
  const { pages, depth } = props;
  const { pathname } = useRouter();

  const childRoutes = pages.reduce(
    (items, page) =>
      reduceChildRoutes({ items, page, currentRoute: pathname, depth }),
    []
  );

  return <React.Fragment>{childRoutes}</React.Fragment>;
};

export default SidebarNavList;
