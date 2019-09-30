import React from "react";

import async from "../components/Async";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { blue, yellow, orange, red, green, grey, purple} from "@material-ui/core/colors";


// Cover components
const Cover = async(() => import("../pages/cover/Cover"));

// Auth components
const SignIn = async(() => import("../pages/auth/SignIn"));
const SignUp = async(() => import("../pages/auth/SignUp"));
const Profile = async(() => import("../pages/auth/Profile"));
const ResetPassword = async(() => import("../pages/auth/ResetPassword"));
const Page404 = async(() => import("./Page404"));
const Page500 = async(() => import("./Page500"));

// Documentation
const Documentation = async(() => import("../pages/docs/Documentation"));
const About = async(() => import("../pages/docs/About"));
const GetInvolved = async(() => import("../pages/docs/GetInvolved"));
const Terms = async(() => import("../pages/docs/Terms"));
const Foundation = async(() => import("../pages/docs/Foundation"));

// Search
const Data = async(() => import("../pages/search/DataListPanel"));
const Tasks = async(() => import("../pages/search/Blank"));
const Flows = async(() => import("../pages/search/Blank"));
const Runs = async(() => import("../pages/search/Blank"));
const Studies = async(() => import("../pages/search/Blank"));
const TaskTypes = async(() => import("../pages/search/Blank"));
const Measures = async(() => import("../pages/search/Blank"));
const People = async(() => import("../pages/search/Blank"));

const GreenMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: green[400],
});
const YellowMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: yellow[700],
});
const LightBlueMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: blue[300],
});
const BlueMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: blue[800],
});
const RedMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: red[400],
});
const PurpleMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: purple[600],
});
const OrangeMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: orange[400],
});
const GreyMenuIcon = styled(FontAwesomeIcon)({
    cursor: 'pointer',
    color: grey[400],
});

const dataRoutes = {
  id: "Data sets",
  path: "/datasets",
  header: "Discover",
  icon: <GreenMenuIcon icon="database" fixedWidth />,
  component: Data,
  badge: "10",
  children: null
};

const taskRoutes = {
  id: "Tasks",
  path: "/tasks",
  icon: <YellowMenuIcon icon={['fas', 'flag']} fixedWidth />,
  component: Tasks,
  children: null
};

const flowRoutes = {
  id: "Flows",
  path: "/flows",
  icon: <BlueMenuIcon icon="cog" fixedWidth />,
  component: Flows,
  children: null
};

const runRoutes = {
  id: "Runs",
  path: "/runs",
  icon: <RedMenuIcon icon="atom" fixedWidth />,
  component: Runs,
  children: null
};

const studyRoutes = {
  id: "Studies",
  path: "/studies",
  icon: <PurpleMenuIcon icon="flask" fixedWidth />,
  component: Studies,
  children: null
};

const taskTypeRoutes = {
  id: "Task Types",
  path: "/tasktypes",
  icon: <OrangeMenuIcon icon={['far', 'flag']} fixedWidth />,
  component: TaskTypes,
  children: null
};

const measureRoutes = {
  id: "Measures",
  path: "/measures",
  icon: <GreyMenuIcon icon="chart-bar" fixedWidth />,
  component: Measures,
  children: null
};

const peopleRoutes = {
  id: "People",
  path: "/people",
  icon: <LightBlueMenuIcon icon="users" fixedWidth />,
  component: People,
  children: null
};

const profileRoutes = {
  id: "Profile",
  path: "/auth/profile",
  icon: <GreenMenuIcon icon="user" fixedWidth />,
  component: Profile,
  children: null
};

const coverRoutes = {
  id: "Cover",
  path: "/",
  component: Cover,
  children: null,
  background: 'Gradient',
};

const authRoutes = {
  id: "Auth",
  path: "/auth",
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn
    },
    {
      path: "/auth/sign-up",
      name: "Sign Up",
      component: SignUp
    },
    {
      path: "/auth/reset-password",
      name: "Reset Password",
      component: ResetPassword
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500
    }
  ]
};

const documentationRoutes = {
  id: "Documentation",
  path: "/documentation",
  header: "Learn more",
  icon: <GreenMenuIcon icon="book-open" fixedWidth />,
  component: Documentation,
  children: null
};

const contributeRoutes = {
  id: "Get involved",
  path: "/contribute",
  icon: <YellowMenuIcon icon="hand-holding-heart" fixedWidth />,
  component: GetInvolved,
  children: null
};

const foundationRoutes = {
  id: "OpenML Foundation",
  path: "/foundation",
  icon: <BlueMenuIcon icon="hands-helping" fixedWidth />,
  component: Foundation,
  children: null
};

const termsRoutes = {
  id: "Terms & Citation",
  path: "/terms",
  icon: <RedMenuIcon icon="heart" fixedWidth />,
  component: Terms,
  children: null
};

const teamRoutes = {
  id: "Our team",
  path: "/team",
  icon: <PurpleMenuIcon icon="user-friends" fixedWidth />,
  component: About,
  children: null
};


export const mainRoutes = [
  coverRoutes,
  dataRoutes,
  taskRoutes,
  flowRoutes,
  runRoutes,
  studyRoutes,
  taskTypeRoutes,
  profileRoutes,
  measureRoutes,
  peopleRoutes,
  documentationRoutes,
  contributeRoutes,
  foundationRoutes,
  termsRoutes,
  teamRoutes,
];

export const clearRoutes = [authRoutes];

export default [
  dataRoutes,
  taskRoutes,
  flowRoutes,
  runRoutes,
  studyRoutes,
  taskTypeRoutes,
  measureRoutes,
  peopleRoutes,
  documentationRoutes,
  contributeRoutes,
  foundationRoutes,
  termsRoutes,
  teamRoutes,
];
