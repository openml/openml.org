import { useRouter } from "next/router";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Typography } from "@mui/material";
import DashboardLayout from "../../layouts/Dashboard";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getItem } from "../api/getItem";
import { shortenName } from "./flowCard";

export async function getStaticPaths() {
  // No paths are pre-rendered
  return { paths: [], fallback: "blocking" }; // or fallback: true, if you prefer
}

export async function getStaticProps({ params, locale }) {
  // Fetch necessary data for the flow page using params.flowId
  const data = await getItem("flow", params.flowId);

  return {
    props: {
      data,
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

function Flow({ data }) {
  const router = useRouter();
  const flowId = router.query.flowId;
  return (
    <React.Fragment>
      <Helmet title="OpenML Flows" />
      <Typography variant="h3" gutterBottom>
        Flow {flowId}
      </Typography>
      <Typography variant="p" gutterBottom>
        {data.name}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {shortenName(data.name)}
      </Typography>
    </React.Fragment>
  );
}

Flow.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Flow;
