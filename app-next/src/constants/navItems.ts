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
  titleKey: string; // Translation key for i18n
  href: string;
  icon?: IconDefinition;
  color?: string;
  index?: string;
  children?: NavItem[];
  isExternal?: boolean; // Flag for external links
}

export const navItems: { title: string; titleKey: string; items: NavItem[] }[] =
  [
    {
      title: "Explore",
      titleKey: "explore",
      items: [
        {
          title: "Datasets",
          titleKey: "datasets",
          href: "/datasets",
          icon: faDatabase,
          color: entityColors.data,
          index: "data",
        },
        {
          title: "Tasks",
          titleKey: "tasks",
          href: "/tasks",
          icon: faFlag,
          color: entityColors.task,
          index: "task",
        },
        {
          title: "Flows",
          titleKey: "flows",
          href: "/flows",
          icon: faCog,
          color: entityColors.flow,
          index: "flow",
        },
        {
          title: "Runs",
          titleKey: "runs",
          href: "/runs",
          icon: faFlask,
          color: entityColors.run,
          index: "run",
        },
        {
          title: "Collections",
          titleKey: "collections",
          href: "/collections",
          icon: faLayerGroup,
          color: entityColors.collections,
          children: [
            {
              title: "Tasks",
              titleKey: "taskCollections",
              href: "/collections/tasks",
            },
            {
              title: "Runs",
              titleKey: "runCollections",
              href: "/collections/runs",
            },
          ],
        },
        {
          title: "Benchmarks",
          titleKey: "benchmarks",
          href: "/benchmarks",
          icon: faChartColumn,
          color: entityColors.benchmarks,
          children: [
            {
              title: "Task Suites",
              titleKey: "taskSuites",
              href: "/benchmarks/tasks",
            },
            {
              title: "Run Studies",
              titleKey: "runStudies",
              href: "/benchmarks/runs",
            },
          ],
        },
        {
          title: "Measures",
          titleKey: "measures",
          href: "/measures",
          icon: faTachometerAlt,
          color: entityColors.measures,
          children: [
            {
              title: "Data Qualities",
              titleKey: "dataQualities",
              href: "/measures/data",
            },
            {
              title: "Model Evaluations",
              titleKey: "modelEvaluations",
              href: "/measures/evaluation",
            },
            {
              title: "Test Procedures",
              titleKey: "testProcedures",
              href: "/measures/procedures",
            },
          ],
        },
      ],
    },
    {
      title: "Learn",
      titleKey: "learn",
      items: [
        {
          title: "Documentation",
          titleKey: "documentation",
          href: "/documentation",
          icon: faBookOpenReader,
          color: entityColors.docs,
        },
        {
          title: "APIs",
          titleKey: "apis",
          href: "/apis",
          icon: faRocket,
          color: entityColors.apis,
        },
        {
          title: "Contribute",
          titleKey: "contribute",
          href: "/contribute",
          icon: faHandHoldingHeart,
          color: entityColors.contribute,
        },
        {
          title: "Terms & Citation",
          titleKey: "termsAndCitation",
          href: "/terms",
          icon: faScaleBalanced,
          color: entityColors.terms,
        },
      ],
    },
    {
      title: "Community",
      titleKey: "community",
      items: [
        {
          title: "About Us",
          titleKey: "aboutUs",
          href: "/about",
          icon: faUsers,
          color: entityColors.about,
        },
        {
          title: "Meet Up",
          titleKey: "meetUp",
          href: "/meet",
          icon: faCampground,
          color: entityColors.meet,
        },
        {
          title: "Discussions",
          titleKey: "discussions",
          href: "https://github.com/orgs/openml/discussions",
          icon: faComments,
          color: entityColors.discussions,
          isExternal: true, // Mark as external link
        },
      ],
    },
    {
      title: "Extra",
      titleKey: "extra",
      items: [
        {
          title: "User Profiles",
          titleKey: "users",
          href: "/users",
          icon: faUsers,
          color: "#42A5F5",
          index: "user",
        },
        {
          title: "Account",
          titleKey: "account",
          href: "/auth/account",
          icon: faUser,
          color: entityColors.auth,
        },
      ],
    },
  ];
