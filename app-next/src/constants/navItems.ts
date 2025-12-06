// app-next/src/constants/navItems.ts
import { entityColors } from "./entityColors";
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
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

export interface NavItem {
  title: string;
  href: string;
  icon?: IconDefinition;
  color?: string;
  index?: string;
  children?: NavItem[];
}

export const navItems: { title: string; items: NavItem[] }[] = [
  {
    title: "Explore",
    items: [
      {
        title: "Datasets",
        href: "/datasets",
        icon: faDatabase,
        color: entityColors.data,
        index: "data",
      },
      {
        title: "Tasks",
        href: "/tasks",
        icon: faFlag,
        color: entityColors.task,
        index: "task",
      },
      {
        title: "Flows",
        href: "/flows",
        icon: faCog,
        color: entityColors.flow,
        index: "flow",
      },
      {
        title: "Runs",
        href: "/runs",
        icon: faFlask,
        color: entityColors.run,
        index: "run",
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
