import React from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { spacing } from "@mui/system";

import DashboardLayout from "../layouts/Dashboard";
import Header from "../components/Header";
import InfoCard from "../components/Card";
import Wrapper from "../components/Wrapper";

import { Grid, Fab, Zoom, Typography as MuiTypography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingHeart,
  faDonate,
  faDove,
  faHandsHelping,
  faHandHoldingDollar,
  faUsersCog,
  faUserAstronaut,
  faSeedling,
  faUserTie,
  faCode,
  faBookOpen,
  faAtom,
  faCloud,
  faDrawPolygon,
  faBookReader,
  faDatabase,
  faUsers,
  faBlog,
  faMedal,
  faTShirt,
  faComments,
  faGlassCheers,
  faLightbulb,
  faBoltLightning,
  faEnvelope,
  faChildReaching,
} from "@fortawesome/free-solid-svg-icons";

import {
  faGithub,
  faJava,
  faPython,
  faRProject,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import { purple, blue, red, yellow, green, orange } from "@mui/material/colors";

import { animated } from "@react-spring/web";
import useBoop from "../components/Boop.js";

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

const OpenMLDove = (props) => {
  const [style, trigger] = useBoop({
    rotation: -45,
    scale: 3,
    x: 50,
    y: -50,
    timing: 300,
  });
  style.color = props.color;
  style.display = "inline-block";
  style.paddingLeft = 20;
  style.zIndex = 5000;
  style.position = "relative";
  return (
    <animated.div style={style} onMouseEnter={trigger}>
      <FontAwesomeIcon icon={faDove} size="lg" style={{ color: props.color }} />
    </animated.div>
  );
};

const Typography = styled(MuiTypography)(spacing);

const ContactButton = styled(Fab)`
  margin: 0;
  top: 85px;
  bottom: auto;
  left: auto;
  position: fixed;
`;
const HeroTitle = styled(Typography)`
  text-align: center;
  line-height: 150%;
  padding: 2vw 5v;
`;
const HeroSubTitle = styled(Typography)`
  text-align: center;
  line-height: 150%;
  font-size: 1.1rem;
  padding-top: 0.5vw;
`;

const Hero = () => {
  const { t } = useTranslation();
  return (
    <HeroTitle variant="h3" align="center" py={12}>
      <OpenMLDove color={red[500]} />
      <OpenMLDove color={yellow[800]} />
      <OpenMLDove color={green[500]} />
      <OpenMLDove color={blue[500]} />
      <HeroSubTitle style={{ paddingTop: 20 }}>
        {t("contribute.hero.line1")}
        <br />
        {t("contribute.hero.line2")}
        <br />
        {t("contribute.hero.line3")}
        <br />
        {t("contribute.hero.line4")}
        <br />
        {t("contribute.hero.line5")}
        <br />
        {t("contribute.hero.line6")}
      </HeroSubTitle>
    </HeroTitle>
  );
};

const help_dev = {
  id: "contribute.help_dev",
  icon: faUsersCog,
  iconColor: red[500],
  chips: [
    {
      link: "#help",
      icon: faBoltLightning,
    },
  ],
};

const help_science = {
  id: "contribute.help_science",
  icon: faUserAstronaut,
  iconColor: orange[700],
  chips: [
    {
      link: "#help",
      icon: faBoltLightning,
    },
  ],
};

const help_donate = {
  id: "contribute.help_donate",
  icon: faChildReaching,
  iconColor: green[500],
  chips: [
    {
      link: "#support",
      icon: faBoltLightning,
    },
    {
      link: "about",
      icon: faComments,
    },
  ],
};

const help_exec = {
  id: "contribute.help_exec",
  icon: faUserTie,
  iconColor: blue[400],
  chips: [
    {
      link: "#sponsor",
      icon: faBoltLightning,
    },
    {
      link: "about",
      icon: faComments,
    },
  ],
};

const code = {
  id: "contribute.code",
  icon: faCode,
  iconColor: blue[400],
  chips: [
    {
      link: "https://docs.openml.org/Website/",
      icon: faBookOpen,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml.org/issues",
      icon: faAtom,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/OpenML/issues",
      icon: faCloud,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-python/issues",
      icon: faPython,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-r/issues",
      icon: faRProject,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-java/issues",
      icon: faJava,
      target: "_blank",
    },
  ],
};

const website = {
  id: "contribute.website",
  icon: faDrawPolygon,
  iconColor: purple[400],
  chips: [
    {
      link: "https://docs.openml.org/Website/",
      icon: faBookOpen,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml.org/issues",
      icon: faAtom,
      target: "_blank",
    },
  ],
};

const docs = {
  id: "contribute.docs",
  icon: faBookReader,
  iconColor: red[800],
  chips: [
    {
      link: "https://docs.openml.org",
      icon: faBookOpen,
      target: "_blank",
    },
    {
      link: "https://docs.openml.org/OpenML-Docs/",
      icon: faGithub,
      target: "_blank",
    },
  ],
};

const datasets = {
  id: "contribute.datasets",
  icon: faDatabase,
  iconColor: green[400],
  chips: [
    {
      link: "https://github.com/openml/openml-data/issues",
      icon: faGithub,
      target: "_blank",
    },
  ],
};

const ambassador = {
  id: "contribute.ambassador",
  icon: faUsers,
  iconColor: red[200],
  chips: [
    {
      link: "https://openml.github.io/blog",
      icon: faBlog,
      target: "_blank",
    },
    {
      link: "https://twitter.com/open_ml",
      icon: faTwitter,
      target: "_blank",
    },
  ],
};

const donate = {
  id: "contribute.donate",
  widgets: [
    {
      button: `https://opencollective.com/openml/donate/button@2x.png?color=blue`,
      link: "https://opencollective.com/openml",
      target: "_blank",
    },
    {
      button: `/static/img/githubsponsor.png`,
      link: "https://github.com/sponsors/openml",
      target: "_blank",
    },
  ],
};

const sponsor_why = {
  id: "contribute.sponsor_why",
};

const sponsor_what = {
  id: "contribute.sponsor_what",
  items: [
    {
      icon: faMedal,
      color: purple[500],
    },
    {
      icon: faTShirt,
      color: purple[500],
    },
    {
      icon: faComments,
      color: purple[500],
    },
    {
      icon: faGlassCheers,
      color: purple[500],
    },
    {
      icon: faLightbulb,
      color: purple[500],
    },
    {
      icon: faHandsHelping,
      color: purple[500],
    },
  ],
  chips: [
    {
      icon: faEnvelope,
      link: "mailto:openmlhq@googlegroups.com",
      color: purple[700],
    },
  ],
};

const sponsor_how = {
  id: "contribute.sponsor_how",
  widgets: [
    {
      button: `https://opencollective.com/openml/donate/button@2x.png?color=blue`,
      link: "https://opencollective.com/openml",
      target: "_blank",
    },
    {
      button: `/static/img/githubsponsor.png`,
      link: "https://github.com/sponsors/openml",
      target: "_blank",
    },
  ],
};

function Contribute() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <Wrapper>
      <Helmet title={t("contribute.helmet")} />
      <Zoom in={true} style={{ transitionDelay: "1000ms" }}>
        <ContactButton
          color="secondary"
          size="medium"
          style={{ right: 16 }}
          href="https://opencollective.com/openml"
          target="_blank"
        >
          <FontAwesomeIcon icon={faDonate} size="lg" />
        </ContactButton>
      </Zoom>
      <Grid container spacing={10}>
        <Grid size={12}>
          <Hero />
        </Grid>
        <Grid size={12}>
          <Header
            id="intro"
            title={t("contribute.header.intro")}
            icon={faSeedling}
            color={green[400]}
          />
        </Grid>
        {[help_dev, help_science, help_exec, help_donate].map((card) => (
          <Grid
            display="flex"
            key={card.id}
            size={{
              xs: 12,
              sm: 6
            }}>
            <InfoCard info={card} />
          </Grid>
        ))}
        <Grid size={12}>
          <Header
            id="help"
            title={t("contribute.header.contribute")}
            icon={faHandHoldingHeart}
            color={red[400]}
          />
        </Grid>
        {[code, website, docs, datasets, ambassador].map((card) => (
          <Grid
            display="flex"
            key={card.id}
            size={{
              xs: 12,
              sm: 6,
              lg: 4
            }}>
            <InfoCard info={card} />
          </Grid>
        ))}
        <Grid size={12}>
          <Header
            id="support"
            title={t("contribute.header.donation")}
            icon={faHandHoldingDollar}
            color={blue[500]}
          />
        </Grid>
        <Grid size={12}>
          <InfoCard info={donate} />
        </Grid>
        <Grid size={12}>
          <Header
            id="sponsor"
            title={t("contribute.header.sponsor")}
            icon={faHandsHelping}
            color={blue[500]}
          />
        </Grid>
        {[sponsor_why, sponsor_how, sponsor_what].map((card) => (
          <Grid key={card.id} size={12}>
            <InfoCard info={card} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
}

Contribute.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Contribute;
