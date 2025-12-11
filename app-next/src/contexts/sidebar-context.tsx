"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  homeMenuOpen: boolean;
  setHomeMenuOpen: (open: boolean) => void;
  homeMenuIconOnly: boolean;
  setHomeMenuIconOnly: (iconOnly: boolean) => void;
  burgerClicked: boolean;
  setBurgerClicked: (clicked: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [homeMenuOpen, setHomeMenuOpen] = useState(true);
  const [homeMenuIconOnly, setHomeMenuIconOnly] = useState(true);
  const [burgerClicked, setBurgerClicked] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        homeMenuOpen,
        setHomeMenuOpen,
        homeMenuIconOnly,
        setHomeMenuIconOnly,
        burgerClicked,
        setBurgerClicked,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
