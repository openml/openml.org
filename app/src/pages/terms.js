import React from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";

import DashboardLayout from "../layouts/Dashboard";

import { Grid, Typography as MuiTypography } from "@mui/material";
import { spacing } from "@mui/system";
import Wrapper from "../components/Wrapper";

// Server-side translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  faComments,
  faPhoneAlt,
  faScaleBalanced,
  faUniversalAccess,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCreativeCommons,
  faCreativeCommonsBy,
  faOsi,
} from "@fortawesome/free-brands-svg-icons";
import { blue, green, purple } from "@mui/material/colors";
import Header from "../components/Header";
import InfoCard from "../components/Card";
export async function getStaticProps({ locale }) {
  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

const Typography = styled(MuiTypography)(spacing);
const Title = styled(Typography)`
  padding-top: 1em;
`;

const contact = {
  id: "terms.contact",
  icon: faUniversalAccess,
  iconColor: blue[400],
  items: [
    {
      link: "http://creativecommons.org/licenses/by/4.0/",
      icon: faCreativeCommonsBy,
      color: green[400],
    },
    {
      link: "https://opensource.org/licenses/BSD-3-Clause",
      icon: faOsi,
      color: blue[400],
    },
    {
      link: "https://creativecommons.org/publicdomain/zero/1.0/",
      icon: faCreativeCommons,
      color: purple[400],
    },
  ],
};

function Terms() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <Wrapper>
      <Helmet title={t("terms.helmet")} />
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Title variant="h2" align="center">
            {t("terms.title")}
          </Title>
        </Grid>
        <Grid item xs={12}>
          <Header
            id="contact"
            title={t("terms.header.licence")}
            icon={faScaleBalanced}
            color={green[500]}
          />
          <InfoCard info={contact} />
        </Grid>
      </Grid>
    </Wrapper>
  );
}

Terms.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Terms;
