"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDatabase,
  faFlag,
  faCog,
  faFlask,
  faLayerGroup,
  faChartColumn,
  faTachometerAlt,
  faUser,
  faBookOpenReader,
  faRocket,
  faHandHoldingHeart,
  faScaleBalanced,
  faUsers,
  faCampground,
  faComments,
} from "@fortawesome/free-solid-svg-icons";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

// Entity colors from old app (variants.js)
const entityColors: Record<string, string> = {
  data: "#66bb6a", // green[400]
  task: "#f9a825", // yellow[800]
  flow: "#2f65cb", // customBlue[800]
  run: "#ef5350", // red[400]
  collections: "#ec407a", // pink[400]
  benchmarks: "#ab47bc", // purple[400]
  measures: "#7e57c2", // deepPurple[400]
  docs: "#66bb6a", // green[400]
  discussions: "#1565c0", // blue[800]
  apis: "#ef5350", // red[400]
  contribute: "#ab47bc", // purple[400]
  meet: "#f9a825", // yellow[800]
  about: "#66bb6a", // green[400]
  terms: "#42a5f5", // blue[400]
  auth: "#29b6f6", // lightBlue[500]
};

interface NavItem {
  title: string;
  href: string;
  icon?: any;
  color?: string;
  children?: NavItem[];
}

const navItems: { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: [
      {
        title: "Datasets",
        href: "/datasets",
        icon: faDatabase,
        color: entityColors.data,
      },
      {
        title: "Tasks",
        href: "/tasks",
        icon: faFlag,
        color: entityColors.task,
      },
      {
        title: "Flows",
        href: "/flows",
        icon: faCog,
        color: entityColors.flow,
      },
      {
        title: "Runs",
        href: "/runs",
        icon: faFlask,
        color: entityColors.run,
      },
      {
        title: "Collections",
        href: "/collections",
        icon: faLayerGroup,
        color: entityColors.collections,
        children: [
          { title: "Tasks", href: "/collections/tasks" },
          { title: "Runs", href: "/collections/runs" },
        ],
      },
      {
        title: "Benchmarks",
        href: "/benchmarks",
        icon: faChartColumn,
        color: entityColors.benchmarks,
        children: [
          { title: "Task Suites", href: "/benchmarks/tasks" },
          { title: "Run Studies", href: "/benchmarks/runs" },
        ],
      },
      {
        title: "Measures",
        href: "/measures",
        icon: faTachometerAlt,
        color: entityColors.measures,
        children: [
          { title: "Data Qualities", href: "/measures/data" },
          { title: "Model Evaluations", href: "/measures/evaluation" },
          { title: "Test Procedures", href: "/measures/procedures" },
        ],
      },
    ],
  },
  {
    title: "Learn",
    items: [
      {
        title: "Documentation",
        href: "https://docs.openml.org",
        icon: faBookOpenReader,
        color: entityColors.docs,
      },
      {
        title: "APIs",
        href: "/apis",
        icon: faRocket,
        color: entityColors.apis,
      },
      {
        title: "Contribute",
        href: "/contribute",
        icon: faHandHoldingHeart,
        color: entityColors.contribute,
      },
      {
        title: "Terms & Citation",
        href: "/terms",
        icon: faScaleBalanced,
        color: entityColors.terms,
      },
    ],
  },
  {
    title: "Community",
    items: [
      {
        title: "About Us",
        href: "/about",
        icon: faUsers,
        color: entityColors.about,
      },
      {
        title: "Meet Up",
        href: "/meet",
        icon: faCampground,
        color: entityColors.meet,
      },
      {
        title: "Discussions",
        href: "https://github.com/orgs/openml/discussions",
        icon: faComments,
        color: entityColors.discussions,
      },
    ],
  },
  {
    title: "Extra",
    items: [
      {
        title: "Auth",
        href: "/auth",
        icon: faUser,
        color: entityColors.auth,
        children: [
          { title: "Sign In", href: "/auth/sign-in" },
          { title: "Sign Up", href: "/auth/sign-up" },
          { title: "Reset Password", href: "/auth/reset-password" },
          { title: "Page Not Found", href: "/auth/404" },
          { title: "Server Error", href: "/auth/500" },
        ],
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Collapsed state - only show expand button */}
      {isCollapsed && !isHomePage && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(false)}
          className="fixed top-2 left-2 z-[100] h-8 w-8 rounded-full border border-gray-600 bg-[#233044] text-gray-200 hover:bg-[#1E2A38] hover:text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Full sidebar */}
      <div
        className={cn(
          "fixed top-0 left-0 z-[100] hidden h-screen border-r-0 bg-[#233044] transition-all duration-300 ease-in-out lg:flex lg:w-64 lg:shrink-0 lg:flex-col",
          isHomePage && "-translate-x-full",
          isCollapsed && "-translate-x-full",
        )}
      >
        {/* Logo Header */}
        <div className="relative flex min-h-[120px] items-center justify-center bg-[#233044] px-6 py-8">
          <Link href="/" className="flex items-center justify-center">
            <Image
              src="/logo_openML_dark-bkg.png"
              alt="OpenML Logo"
              width={108}
              height={108}
              className="object-contain"
            />
          </Link>

          {/* Collapse Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="absolute top-1/2 -right-3 h-6 w-6 -translate-y-1/2 rounded-full border border-gray-600 bg-[#1E2A38] text-gray-200 hover:bg-[#1E2A38] hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <div className="space-y-6 px-3">
            {navItems.map((section) => (
              <div key={section.title}>
                <h4 className="mb-2 px-3 text-xs font-semibold tracking-tight text-gray-400 uppercase">
                  {section.title}
                </h4>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.href}
                      item={item}
                      pathname={pathname}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

function SidebarItem({ item, pathname }: { item: NavItem; pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between px-3 text-gray-200 hover:bg-[#1E2A38] hover:text-white",
            isActive && "bg-[#1E2A38] font-medium text-white",
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="flex items-center gap-2">
            {item.icon && (
              <FontAwesomeIcon
                icon={item.icon}
                className="h-4 w-4"
                style={{ color: item.color, width: "16px" }}
              />
            )}
            <span className="text-sm">{item.title}</span>
          </span>
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        {isOpen && (
          <div className="ml-6 space-y-1 border-l border-gray-600 pl-2">
            {item.children?.map((child) => (
              <SidebarItem key={child.href} item={child} pathname={pathname} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        "w-full justify-start px-3 text-gray-200 hover:bg-[#1E2A38] hover:text-white",
        isActive && "bg-[#1E2A38] font-medium text-white",
      )}
    >
      <Link href={item.href}>
        {item.icon && (
          <FontAwesomeIcon
            icon={item.icon}
            className="mr-2 h-4 w-4"
            style={{ color: item.color, width: "16px" }}
          />
        )}
        <span className="text-sm">{item.title}</span>
      </Link>
    </Button>
  );
}
