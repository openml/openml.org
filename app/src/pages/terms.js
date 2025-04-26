import React from "react";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";

import DashboardLayout from "../layouts/Dashboard";

import { Grid, Typography as MuiTypography } from "@mui/material";
import { spacing } from "@mui/system";
import Wrapper from "../components/Wrapper";

// Server-side translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {
  faAward,
  faBookOpen,
  faChartColumn,
  faCopy,
  faEyeSlash,
  faFileContract,
  faGavel,
  faHeart,
  faLayerGroup,
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
import {
  blue,
  deepPurple,
  green,
  purple,
  red,
  yellow,
} from "@mui/material/colors";
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

const bibtex = {
  openml: `@article{OpenML2013,
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
  }`,
  python: `@article{OpenMLPython2021,
    author = {Matthias Feurer and Jan N. van Rijn and Arlind Kadra and Pieter Gijsbers and Neeratyoy Mallik and Sahithya Ravi and Andreas Mueller and Joaquin Vanschoren and Frank Hutter},
    title = {OpenML-Python: an extensible Python API for OpenML},
    journal = {arXiv},
    volume = {1911.02490},
    number = {},
    year = {2020},
    pages = {},
    url = {https://arxiv.org/pdf/1911.02490.pdf},
    doi = {},
    publisher = {}
  }`,
  r: `
  @article{OpenMLR2017,
    author = {Giuseppe Casalicchio and Jakob Bossek and Michel Lang and Dominik Kirchhoff and Pascal Kerschke and Benjamin Hofner and Heidi Seibold and Joaquin Vanschoren and Bernd Bischl},
    title = {OpenML: An R package to connect to the machine learning platform OpenML},
    journal = {Computational Statistics},
    volume = {32},
    number = {3},
    year = {2017},
    pages = {1-15},
    url = {http://doi.acm.org/10.1007/s00180-017-0742-2},
    doi = {10.1007/s00180-017-0742-2},
    publisher = {Springer Nature}
  }`,
  benchmark: `
  @article{OpenMLSuites2021,
    author = {Bernd Bischl and Giuseppe Casalicchio and Matthias Feurer and Pieter Gijsbers and Frank Hutter and Michel Lang and Rafael Gomes Mantovani and Jan N. van Rijn and Joaquin Vanschoren},
    title = {OpenML: A benchmarking layer on top of OpenML to quickly create, download, and share systematic benchmarks},
    journal = {NeurIPS},
    volume = {},
    number = {},
    year = {2021},
    pages = {},
    url = {https://openreview.net/forum?id=OCrD8ycKjG},
    doi = {},
    publisher = {}
  }`,
};

const cite_openml = {
  id: "terms.cite_openml",
  icon: faLayerGroup,
  iconColor: green[500],
  chips: [
    {
      link: "https://www.kdd.org/exploration_files/15-2-2013-12.pdf#page=51",
      icon: faBookOpen,
      target: "_blank",
    },
    {
      text: bibtex.openml,
      message: "terms.bibtex_copied",
      icon: faCopy,
    },
  ],
};

const cite_python = {
  id: "terms.cite_python",
  icon: faPython,
  iconColor: yellow[800],
  chips: [
    {
      link: "https://jmlr2020.csail.mit.edu/papers/volume22/19-920/19-920.pdf",
      icon: faBookOpen,
      target: "_blank",
    },
    {
      text: bibtex.python,
      message: "terms.bibtex_copied",
      icon: faCopy,
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
    {
      text: bibtex.r,
      message: "terms.bibtex_copied",
      icon: faCopy,
    },
  ],
};

const cite_benchmark = {
  id: "terms.cite_benchmark",
  icon: faChartColumn,
  iconColor: purple[400],
  chips: [
    {
      link: "https://datasets-benchmarks-proceedings.neurips.cc/paper_files/paper/2021/hash/c7e1249ffc03eb9ded908c236bd1996d-Abstract-round2.html",
      icon: faBookOpen,
      target: "_blank",
    },
    {
      text: bibtex.benchmark,
      message: "terms.bibtex_copied",
      icon: faCopy,
    },
  ],
};

const honor_code = {
  id: "terms.honorcode",
  icon: faAward,
  iconColor: green[500],
};

const terms = {
  id: "terms.termsofuse",
  icon: faGavel,
  iconColor: green[500],
};

const privacy_policy = {
  id: "terms.privacy",
  icon: faEyeSlash,
  iconColor: green[500],
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
        <Grid size={12}>
          <Title variant="h2" align="center">
            {t("terms.title")}
          </Title>
        </Grid>
        <Grid size={12}>
          <Header
            id="licence"
            title={t("terms.header.licence")}
            icon={faScaleBalanced}
            color={green[500]}
          />
          <InfoCard info={contact} />
        </Grid>
        <Grid size={12}>
          <Header
            id="citation"
            title={t("terms.header.citation")}
            subtitle={t("terms.header.citation_sub")}
            icon={faHeart}
            color={red[400]}
          />
        </Grid>
        {[cite_openml, cite_python, cite_r, cite_benchmark].map((card) => (
          <Grid
            display="flex"
            key={card.id}
            size={{
              xs: 12,
              sm: 6,
            }}
          >
            <InfoCard info={card} />
          </Grid>
        ))}
        <Grid size={12}>
          <Header
            id="termsofuse"
            title={t("terms.header.termsofuse")}
            icon={faFileContract}
            color={deepPurple[400]}
          />
        </Grid>
        {[honor_code, terms, privacy_policy].map((card) => (
          <Grid display="flex" key={card.id} size={12}>
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
