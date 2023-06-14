import React from "react";

import SidebarNavListItem from "./SidebarNavListItem";
import SidebarNavList from "./SidebarNavList";

const reduceChildRoutes = (props) => {
  const { items, page, depth, currentRoute } = props;

  if (page.children) {
    const open = currentRoute.includes(page.href);

    items.push(
      <SidebarNavListItem
        depth={depth}
        color={page.color}
        key={page.title}
        badge={page.badge}
        open={!!open}
        title={page.title}
        href={page.href}
      >
        <SidebarNavList depth={depth + 1} pages={page.children} />
      </SidebarNavListItem>
    );
  } else {
    items.push(
      <SidebarNavListItem
        depth={depth}
        href={page.href}
        color={page.color}
        key={page.title}
        badge={page.badge}
        title={page.title}
      />
    );
  }

  return items;
};

export default reduceChildRoutes;
