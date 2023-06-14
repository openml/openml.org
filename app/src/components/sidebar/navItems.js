const openmlSection = [
  {
    href: "/d",
    title: "Datasets",
    badge: "100",
  },
  {
    href: "/t",
    title: "Tasks",
    badge: "100",
  },
  {
    href: "/f",
    title: "Flows",
    badge: "100",
  },
  {
    href: "/r",
    title: "Runs",
    badge: "100",
  },
  {
    href: "/collections",
    title: "Collections",
    children: [
      {
        href: "/collections/tasks",
        title: "Tasks",
        badge: "100",
      },
      {
        href: "/collections/runs",
        title: "Runs",
        badge: "100",
      },
    ],
  },
  {
    href: "/benchmarks",
    title: "Benchmarks",
    children: [
      {
        href: "/benchmarks/tasks",
        title: "Task Suites",
        badge: "100",
      },
      {
        href: "/benchmarks/runs",
        title: "Run Studies",
        badge: "100",
      },
    ],
  },
  {
    href: "/measures",
    title: "Measures",
    children: [
      {
        href: "/measures/data",
        title: "Data qualities",
        badge: "100",
      },
      {
        href: "/measures/evaluation",
        title: "Model Evaluations",
        badge: "100",
      },
      {
        href: "/measures/procedures",
        title: "Test procedures",
        badge: "100",
      },
    ],
  },
];

const extraSection = [
  {
    href: "/auth",
    title: "Auth",
    children: [
      {
        href: "/auth/sign-in",
        title: "Sign In",
      },
      {
        href: "/auth/sign-up",
        title: "Sign Up",
      },
      {
        href: "/auth/reset-password",
        title: "Reset Password",
      },
      {
        href: "/auth/404",
        title: "404 Page",
      },
      {
        href: "/auth/500",
        title: "500 Page",
      },
    ],
  },
];

const learnSection = [
  {
    href: "https://docs.openml.org/",
    title: "Docs",
  },
  {
    href: "https://blog.openml.org/",
    title: "Blog",
  },
  {
    href: "/apis",
    title: "APIs",
  },
  {
    href: "/contribute",
    title: "Contribute",
  },
  {
    href: "/meet",
    title: "Meet up",
  },
  {
    href: "/about",
    title: "About us",
  },
  {
    href: "/terms",
    title: "Terms & Citation",
  },
];

const navItems = [
  {
    title: "Explore",
    pages: openmlSection,
  },
  {
    title: "Learn",
    pages: learnSection,
  },
  {
    title: "Extra",
    pages: extraSection,
  },
];

export default navItems;
