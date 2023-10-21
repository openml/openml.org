import React from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";
import TableView from "../../components/TableView";

// Server-side translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
export async function getStaticProps({ locale }) {
  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

function UserList() {
  return (
    <React.Fragment>
      <Helmet title="OpenML Users" />
      <Typography variant="h3" gutterBottom>
        Users
      </Typography>

      <TableView />
    </React.Fragment>
  );
}

UserList.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default UserList;
