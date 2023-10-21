import { useRouter } from "next/router";
import React from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";

function User() {
  const router = useRouter();
  const userId = router.query.userId;
  return (
    <React.Fragment>
      <Helmet title="Profile" />
      <Typography variant="h3" gutterBottom>
        User {userId}
      </Typography>
    </React.Fragment>
  );
}

User.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default User;
