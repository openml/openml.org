// app-next/src/constants/navItems.ts
import { entityColors } from "./entityColors";
import { ENTITY_ICONS } from "./entityIcons";
import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

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
          icon: ENTITY_ICONS.dataset,
          color: entityColors.data,
          index: "data",
        },
        {
          title: "Tasks",
          titleKey: "tasks",
          href: "/tasks",
          icon: ENTITY_ICONS.task,
          color: entityColors.task,
          index: "task",
        },
        {
          title: "Flows",
          titleKey: "flows",
          href: "/flows",
          icon: ENTITY_ICONS.flow,
          color: entityColors.flow,
          index: "flow",
        },
        {
          title: "Runs",
          titleKey: "runs",
          href: "/runs",
          icon: ENTITY_ICONS.run,
          color: entityColors.run,
          index: "run",
        },
        {
          title: "Collections",
          titleKey: "collections",
          href: "/collections",
          icon: ENTITY_ICONS.collection,
          color: entityColors.collections,
          index: "study",
          children: [
            {
              title: "Tasks",
              titleKey: "taskCollections",
              href: "/collections/tasks",
              index: "study_task",
            },
            {
              title: "Runs",
              titleKey: "runCollections",
              href: "/collections/runs",
              index: "study_run",
            },
          ],
        },
        {
          title: "Benchmarks",
          titleKey: "benchmarks",
          href: "/benchmarks",
          icon: ENTITY_ICONS.benchmark,
          color: entityColors.benchmarks,
          index: "study",
          children: [
            {
              title: "Task Suites",
              titleKey: "taskSuites",
              href: "/benchmarks/tasks",
              index: "study_task",
            },
            {
              title: "Run Studies",
              titleKey: "runStudies",
              href: "/benchmarks/runs",
              index: "study_run",
            },
          ],
        },
        {
          title: "Measures",
          titleKey: "measures",
          href: "/measures",
          icon: ENTITY_ICONS.measure,
          color: entityColors.measures,
          index: "measure",
          children: [
            {
              title: "Data Qualities",
              titleKey: "dataQualities",
              href: "/measures/data",
              index: "measure_data_quality",
            },
            {
              title: "Model Evaluations",
              titleKey: "modelEvaluations",
              href: "/measures/evaluation",
              index: "measure_evaluation",
            },
            {
              title: "Test Procedures",
              titleKey: "testProcedures",
              href: "/measures/procedures",
              index: "measure_procedure",
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
          icon: ENTITY_ICONS.docs,
          color: entityColors.docs,
        },
        {
          title: "API's",
          titleKey: "apis",
          href: "/apis",
          icon: ENTITY_ICONS.api,
          color: entityColors.apis,
        },
        {
          title: "Contribute",
          titleKey: "contribute",
          href: "/contribute",
          icon: ENTITY_ICONS.contribute,
          color: entityColors.contribute,
        },
        {
          title: "Terms & Citation",
          titleKey: "termsAndCitation",
          href: "/terms",
          icon: ENTITY_ICONS.terms,
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
          icon: ENTITY_ICONS.about,
          color: entityColors.about,
        },
        {
          title: "Meet Up",
          titleKey: "meetUp",
          href: "/meet-us",
          icon: ENTITY_ICONS.meet,
          color: entityColors.meet,
        },
        {
          title: "Discussions",
          titleKey: "discussions",
          href: "https://github.com/orgs/openml/discussions",
          icon: ENTITY_ICONS.discussions,
          color: entityColors.discussions,
          isExternal: true, // Mark as external link
        },
      ],
    },
  ];
