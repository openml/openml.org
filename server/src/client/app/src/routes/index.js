import React from "react";

import async from "../components/Async";
import styled from "styled-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  blue,
  yellow,
  orange,
  red,
  green,
  grey,
  purple
} from "@material-ui/core/colors";

// Cover components
const Cover = async(() => import("../pages/cover/Cover"));

// Auth components
const SignIn = async(() => import("../pages/auth/SignIn"));
const SignUp = async(() => import("../pages/auth/SignUp"));
const EditProfile = async(() => import("../pages/auth/Profile"));
const ProfilePage = async(() => import("../pages/auth/ProfilePage"));
const ResetPassword = async(() => import("../pages/auth/ResetPassword"));
const ResetPage = async(() => import("../pages/auth/ResetPage"));
const ConfirmPage = async(() => import("../pages/auth/ConfirmPage"));
const ConfirmationToken = async(() => import("../pages/auth/ConfirmationToken"));
const DataUpload = async(() => import("../pages/auth/DataUpload"));
const CollectionRunsUpload = async(() => import("../pages/auth/CollectionRunsUpload"));
const APIPage = async(() => import("../pages/auth/APIKey"));
const Page404 = async(() => import("./Page404"));
const Page500 = async(() => import("./Page500"));

// Documentation
const About = async(() => import("../pages/docs/About"));
const GetInvolved = async(() => import("../pages/docs/GetInvolved"));
const Terms = async(() => import("../pages/docs/Terms"));

// Search
const SearchPanel = async(() => import("../pages/search/SearchPanel"));

const GreenMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: green[400]
});
const YellowMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: yellow[700]
});
const LightBlueMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: blue[300]
});
const BlueMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: blue[800]
});
const RedMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: red[400]
});
const PurpleMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: purple[600]
});
const OrangeMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: orange[400]
});
const GreyMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: grey[400]
});

const dataRoutes = {
  id: "Data sets",
  path: "/search",
  header: "Discover",
  icon: <GreenMenuIcon icon="database" fixedWidth />,
  component: SearchPanel,
  entity_type: "data"
};

const taskRoutes = {
  id: "Tasks",
  path: "/search",
  icon: <YellowMenuIcon icon={["fas", "flag"]} fixedWidth />,
  component: SearchPanel,
  entity_type: "task"
};

const flowRoutes = {
  id: "Flows",
  path: "/search",
  icon: <BlueMenuIcon icon="cog" fixedWidth />,
  component: SearchPanel,
  entity_type: "flow"
};

const runRoutes = {
  id: "Runs",
  path: "/search",
  icon: <RedMenuIcon icon="flask" fixedWidth />,
  component: SearchPanel,
  entity_type: "run"
};

const studyRoutes = {
  id: "Collections",
  path: "/search",
  icon: <PurpleMenuIcon icon="layer-group" fixedWidth />,
  component: SearchPanel,
  entity_type: "study",
  subtype_filter: "study_type",
  children: [
    {
      path: "/search",
      name: "Tasks",
      component: SearchPanel,
      subtype: "task"
    },
    {
      path: "/search",
      name: "Runs",
      component: SearchPanel,
      subtype: "run"
    }
  ]
};

const taskTypeRoutes = {
  id: "Task Types",
  path: "/search",
  icon: <OrangeMenuIcon icon={["far", "flag"]} fixedWidth />,
  component: SearchPanel,
  entity_type: "task_type"
};

const peopleRoutes = {
  id: "People",
  path: "/search",
  icon: <LightBlueMenuIcon icon="users" fixedWidth />,
  component: SearchPanel,
  entity_type: "user"
};

const profileRoutes = {
  id: "Profile",
  path: "/auth/profile",
  children: [
    {
      path: "/auth/profile-page",
      name: "User Profile",
      component: ProfilePage
    },
    {
      path: "/auth/edit-profile",
      name: "Edit Profile",
      component: EditProfile
    },
    {
      path: "/auth/api-key",
      name: "API-Key",
      component: APIPage
    },
    {
      path: "/auth/upload-dataset",
      name: "Dataset Upload",
      component: DataUpload
    },
    {
      path: "/auth/upload-collection-runs",
      name: "Collection Runs Upload",
      component: CollectionRunsUpload
    }

    ]

};

const coverRoutes = {
  id: "Cover",
  path: "/",
  component: Cover,
  background: "Gradient"
};

const measureRoutes = {
  id: "Measures",
  path: "/search",
  icon: <GreyMenuIcon icon="chart-bar" fixedWidth />,
  component: SearchPanel,
  entity_type: "measure",
  subtype_filter: "measure_type",
  children: [
    {
      path: "/search",
      name: "Data qualities",
      component: SearchPanel,
      subtype: "data_quality"
    },
    {
      path: "/search",
      name: "Eval. Measures",
      component: SearchPanel,
      subtype: "evaluation_measure"
    },
    {
      path: "/search",
      name: "Eval. Procedures",
      component: SearchPanel,
      subtype: "estimation_procedure"
    }
  ]
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
      path: "/auth/confirm-page",
      name: "Confirmation Page",
      component: ConfirmPage
    },
    {
      path: "/auth/confirmation-token",
      name: "Send Confirmation Again",
      component: ConfirmationToken
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
      path: "/auth/reset-page",
      name: "Reset Page",
      component: ResetPage
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
  path: "https://docs.openml.org",
  header: "Learn more",
  icon: <GreenMenuIcon icon="book-open" fixedWidth />,
  component: null
};

const contributeRoutes = {
  id: "Get involved",
  path: "/contribute",
  icon: <YellowMenuIcon icon="hand-holding-heart" fixedWidth />,
  component: GetInvolved
};

const termsRoutes = {
  id: "Terms & Citation",
  path: "/terms",
  icon: <RedMenuIcon icon="heart" fixedWidth />,
  component: Terms
};

const teamRoutes = {
  id: "About us",
  path: "/about",
  icon: <PurpleMenuIcon icon="user-friends" fixedWidth />,
  component: About
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
  termsRoutes,
  teamRoutes
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
  termsRoutes,
  teamRoutes
];
