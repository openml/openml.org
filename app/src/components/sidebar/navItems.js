const openmlSection = [
  {
    href: "/d/search",
    title: "sidebar.datasets",
    badge: "100",
  },
  {
    href: "/t/search",
    title: "sidebar.tasks",
    badge: "100",
  },
  {
    href: "/f/search",
    title: "sidebar.flows",
    badge: "100",
  },
  {
    href: "/r/search",
    title: "sidebar.runs",
    badge: "100",
  },
  {
    href: "/collections",
    title: "sidebar.collections",
    children: [
      {
        href: "/collections/tasks/search",
        title: "sidebar.tasks",
        badge: "100",
      },
      {
        href: "/collections/runs/search",
        title: "sidebar.runs",
        badge: "100",
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
        badge: "100",
      },
      {
        href: "/benchmarks/runs/search",
        title: "sidebar.run_studies",
        badge: "100",
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
        badge: "100",
      },
      {
        href: "/measures/evaluation/search",
        title: "sidebar.model_evaluations",
        badge: "100",
      },
      {
        href: "/measures/procedures/search",
        title: "sidebar.test_procedures",
        badge: "100",
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

const learnSection = [
  {
    href: "https://docs.openml.org/",
    title: "sidebar.docs",
  },
  {
    href: "https://blog.openml.org/",
    title: "sidebar.blog",
  },
  {
    href: "/apis",
    title: "sidebar.apis",
  },
  {
    href: "/contribute",
    title: "sidebar.contribute",
  },
  {
    href: "/meet",
    title: "sidebar.meet_up",
  },
  {
    href: "/about",
    title: "sidebar.about_us",
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
    title: "sidebar.extra",
    pages: extraSection,
  },
];

export default navItems;
