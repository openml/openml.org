const openmlSection = [
  {
    href: "/d/search",
    title: "sidebar.datasets",
    index: "data",
  },
  {
    href: "/t/search",
    title: "sidebar.tasks",
    index: "task",
  },
  {
    href: "/f/search",
    title: "sidebar.flows",
    index: "flow",
  },
  {
    href: "/r/search",
    title: "sidebar.runs",
    index: "run",
  },
  {
    href: "/collections",
    title: "sidebar.collections",
    children: [
      {
        href: "/collections/tasks/search",
        title: "sidebar.tasks",
        index: "study",
      },
      {
        href: "/collections/runs/search",
        title: "sidebar.runs",
        index: "study",
      },
    ],
  },
  {
    href: "/benchmarks",
    title: "sidebar.benchmarks",
    children: [
      {
        href: "/benchmarks/tasks/search",
        title: "sidebar.task_suites",
        index: "study",
      },
      {
        href: "/benchmarks/runs/search",
        title: "sidebar.run_studies",
        index: "study",
      },
    ],
  },
  {
    href: "/measures",
    title: "sidebar.measures",
    children: [
      {
        href: "/measures/data/search",
        title: "sidebar.data_qualities",
        index: "measure",
      },
      {
        href: "/measures/evaluation/search",
        title: "sidebar.model_evaluations",
        index: "measure",
      },
      {
        href: "/measures/procedures/search",
        title: "sidebar.test_procedures",
        index: "measure",
      },
    ],
  },
];

const extraSection = [
  {
    href: "/auth",
    title: "sidebar.auth",
    children: [
      {
        href: "/auth/sign-in",
        title: "sidebar.sign_in",
      },
      {
        href: "/auth/sign-up",
        title: "sidebar.sign_up",
      },
      {
        href: "/auth/reset-password",
        title: "sidebar.reset_password",
      },
      {
        href: "/auth/404",
        title: "sidebar.page_not_found", // Assuming "404 Page" is "Page Not Found"
      },
      {
        href: "/auth/500",
        title: "sidebar.server_error", // Assuming "500 Page" is "Server Error"
      },
    ],
  },
];

const communitySection = [
  {
    href: "/about",
    title: "sidebar.about_us",
  },
  {
    href: "/meet",
    title: "sidebar.meet_up",
  },
  {
    href: "https://blog.openml.org/",
    title: "sidebar.blog",
  },
];

const learnSection = [
  {
    href: "/apis",
    title: "sidebar.apis",
  },
  {
    href: "/contribute",
    title: "sidebar.contribute",
  },
  {
    href: "/terms",
    title: "sidebar.terms_citation",
  },
];

const navItems = [
  {
    title: "sidebar.explore",
    pages: openmlSection,
  },
  {
    title: "sidebar.learn",
    pages: learnSection,
  },
  {
    title: "sidebar.community",
    pages: communitySection,
  },
  {
    title: "sidebar.extra",
    pages: extraSection,
  },
];

export default navItems;
