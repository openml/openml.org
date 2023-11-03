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
  faBoltLightning,
  faBookOpen,
  faChartColumn,
  faComments,
  faCopy,
  faHeart,
  faLayerGroup,
  faPhoneAlt,
  faR,
  faScaleBalanced,
  faUniversalAccess,
} from "@fortawesome/free-solid-svg-icons";
import {
  faCreativeCommons,
  faCreativeCommonsBy,
  faOsi,
  faPython,
  faRProject,
} from "@fortawesome/free-brands-svg-icons";
import { blue, green, orange, purple, red } from "@mui/material/colors";
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
  id: "terms.licences",
  icon: faUniversalAccess,
  iconColor: blue[400],
  items: [
    {
      link: "http://creativecommons.org/licenses/by/4.0/",
      icon: faCreativeCommonsBy,
      color: green[400],
      target: "_blank",
    },
    {
      link: "https://creativecommons.org/publicdomain/zero/1.0/",
      icon: faCreativeCommons,
      color: purple[400],
      target: "_blank",
    },
    {
      link: "https://opensource.org/licenses/BSD-3-Clause",
      icon: faOsi,
      color: blue[400],
      target: "_blank",
    },
  ],
};

const bibtex_openml = `@article{OpenML2013,
  author = {Joaquin Vanschoren and Jan N. van Rijn and Bernd Bischl and Luis Torgo},
  title = {OpenML: networked science in machine learning},
  journal = {SIGKDD Explorations},
  volume = {15},
  number = {2},
  year = {2013},
  pages = {49-60},
  url = {http://doi.acm.org/10.1145/2641190.264119},
  doi = {10.1145/2641190.2641198},
  publisher = {ACM}
}`;

const cite_openml = {
  id: "terms.cite_openml",
  icon: faLayerGroup,
  iconColor: blue[500],
  chips: [
    {
      link: "https://www.kdd.org/exploration_files/15-2-2013-12.pdf#page=51",
      icon: faBookOpen,
      target: "_blank",
    },
  ],
  bibtex: [
    {
      bibtex: { bibtex_openml },
      icon: faCopy,
      target: "_blank",
    },
  ],
};

const cite_python = {
  id: "terms.cite_python",
  icon: faPython,
  iconColor: blue[500],
  chips: [
    {
      link: "https://jmlr2020.csail.mit.edu/papers/volume22/19-920/19-920.pdf",
      icon: faBookOpen,
      target: "_blank",
    },
  ],
};

const cite_r = {
  id: "terms.cite_r",
  icon: faRProject,
  iconColor: blue[500],
  chips: [
    {
      link: "https://arxiv.org/abs/1701.01293",
      icon: faBookOpen,
      target: "_blank",
    },
  ],
};

const cite_benchmark = {
  id: "terms.cite_benchmark",
  icon: faChartColumn,
  iconColor: blue[400],
  chips: [
    {
      link: "https://datasets-benchmarks-proceedings.neurips.cc/paper_files/paper/2021/hash/c7e1249ffc03eb9ded908c236bd1996d-Abstract-round2.html",
      icon: faBookOpen,
      target: "_blank",
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
            id="licence"
            title={t("terms.header.licence")}
            icon={faScaleBalanced}
            color={green[500]}
          />
          <InfoCard info={contact} />
        </Grid>
        <Grid item xs={12}>
          <Header
            id="intro"
            title={t("terms.header.citation")}
            subtitle={t("terms.header.citation_sub")}
            icon={faHeart}
            color={red[400]}
          />
        </Grid>
        {[cite_openml, cite_python, cite_r, cite_benchmark].map((card) => (
          <Grid item display="flex" xs={12} sm={6} key={card.id}>
            <InfoCard info={card} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}

Terms.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Terms;
