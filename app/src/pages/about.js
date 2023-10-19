import React from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { spacing } from "@mui/system";

import DashboardLayout from "../layouts/Dashboard";
import Header from "../components/Header";
import InfoCard from "../components/Card";
import Wrapper from "../components/Wrapper";

import {
  Card as MuiCard,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Avatar,
  Badge,
  Fab,
  Zoom,
  Typography as MuiTypography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingHeart,
  faBugSlash,
  faUsers,
  faHandsHelping,
  faCloud,
  faDatabase,
  faBlog,
  faChevronDown,
  faRocket,
  faChildReaching,
  faPhoneAlt,
  faEnvelope,
  faHands,
  faComments,
  faDove,
  faUserAstronaut,
} from "@fortawesome/free-solid-svg-icons";

import {
  faJava,
  faPython,
  faReact,
  faRProject,
  faSlack,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import { purple, blue, red, green, pink, grey } from "@mui/material/colors";

// Server-side translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
export async function getStaticProps({ locale }) {
  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

const Card = styled(MuiCard)(spacing);

const Typography = styled(MuiTypography)(spacing);

const ContactButton = styled(Fab)({
  margin: 0,
  top: 85,
  bottom: "auto",
  left: "auto",
  position: "fixed",
});

const HeroTitle = styled(Typography)({
  textAlign: "center",
  lineHeight: "150%",
  padding: "2vw 5vw",
});

const Paragraph = styled(Typography)({
  paddingBottom: "2vw",
});

const ListIcon = styled(FontAwesomeIcon)({
  marginLeft: 10,
  marginRight: 10,
  fontWeight: 800,
});

const BigAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin: 0 auto ${(props) => props.theme.spacing(2)}px;
  background-image: linear-gradient(
    to bottom right,
    DeepSkyBlue,
    MediumVioletRed
  );
`;
const BigBadge = styled(Badge)`
  width: 130px;
  margin-top: -15px;
  position: absolute;
`;

const tc_ids = [1, 2, 27, 86, 348, 970];
const core_ids = [1, 2, 27, 86, 348, 970, 1140, 869, 8111, 9186, 3744];
const active_ids = [10700, 5348, 2902, 8309, 3744];
const contributor_ids = [1478, 5341];

const Person = ({ id, name, bio, image }) => {
  return (
    <Grid item style={{ display: "flex" }} xs={12} sm={3} md={3} lg={2}>
      <Grid container>
        <Grid item style={{ width: "100%" }}>
          <BigAvatar alt="..." src={image} align="center">
            {name.match(/\b(\w)/g).join("")}
          </BigAvatar>
          {core_ids.includes(id) && !tc_ids.includes(id) && (
            <BigBadge badgeContent="core" color="primary" align="center" />
          )}
          {core_ids.includes(id) && tc_ids.includes(id) && (
            <BigBadge badgeContent="SC, core" color="primary" align="center" />
          )}
          <Typography variant="h6" display="block" align="center" gutterBottom>
            {name}
          </Typography>
          <Typography
            variant="caption"
            display="block"
            align="center"
            gutterBottom
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxHeight: 115,
            }}
          >
            {bio}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

function orderList(a, b) {
  if (core_ids.includes(a.user_id) && !core_ids.includes(b.user_id)) return -1;
  else if (core_ids.includes(b.user_id) && !core_ids.includes(a.user_id))
    return 1;
  else if (
    active_ids.includes(a.user_id) &&
    contributor_ids.includes(b.user_id)
  )
    return -1;
  else if (
    active_ids.includes(b.user_id) &&
    contributor_ids.includes(a.user_id)
  )
    return 1;
  else if (a.user_id < b.user_id && b.user_id !== 2) {
    return -1;
  } else return 1;
}

const TitleIcon = styled(FontAwesomeIcon)`
  padding-right: 15px;
`;

const Title = styled(Typography)`
  padding-top: 1em;
`;

const mission = {
  id: "about.mission",
  icon: faDove,
  iconColor: blue[400],
};

const community = {
  id: "about.community",
  icon: faUserAstronaut,
  iconColor: grey[100],
};

const governance = {
  id: "about.governance",
  icon: faUsers,
  iconColor: pink[300],
  chips: [
    {
      link: "https://docs.openml.org/Contributing/",
      icon: faHandHoldingHeart,
    },
    {
      link: "https://docs.openml.org/Governance/",
      icon: faUsers,
    },
    {
      link: "/about#foundation",
      icon: faHandHoldingHeart,
    },
  ],
};

const contributors = {
  id: "about.contributors",
  icon: faHandHoldingHeart,
  iconColor: red[400],
  chips: [
    {
      link: "https://github.com/openml/openml.org#contributors-",
      icon: faReact,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/OpenML#contributors-",
      icon: faCloud,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-python#contributors-",
      icon: faPython,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-r#contributors-",
      icon: faRProject,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-java#contributors-",
      icon: faJava,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-data#contributors-",
      icon: faDatabase,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/blog#contributors-",
      icon: faBlog,
      target: "_blank",
    },
  ],
};

const contact_issues = {
  id: "about.contact_issues",
  icon: faBugSlash,
  iconColor: red[400],
  chips: [
    {
      link: "https://github.com/openml/openml.org#contributors-",
      icon: faReact,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml.org/issues",
      icon: faReact,
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
    {
      link: "https://github.com/openml/openml-data/issues",
      icon: faDatabase,
      target: "_blank",
    },
  ],
};

const contact = {
  id: "about.contact",
  icon: faComments,
  iconColor: blue[400],
  items: [
    {
      link: "mailto:openmlhq@googlegroups.com",
      icon: faEnvelope,
      color: green[400],
    },
    {
      link: "https://twitter.com/intent/tweet?screen_name=open_ml&text=%23openml.org",
      icon: faTwitter,
      color: blue[400],
    },
    {
      link: "https://join.slack.com/t/openml/shared_invite/enQtODg4NjgzNTE4NjU3LTYwZDFhNzQ5NmE0NjIyNmM3NDMyMjFkZDQ0YWZkYWYxMTIxODFmMDhhMTUzMGYzMmM4NjIzYTZlYjBkOGE5MTQ",
      icon: faSlack,
      color: purple[400],
    },
  ],
};

function About() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  let people = [];
  console.log(people);

  return (
    <Wrapper>
      <Helmet title={t("about.helmet")} />
      <Zoom in={true} style={{ transitionDelay: "1000ms" }}>
        <ContactButton
          color="primary"
          size="medium"
          style={{ right: 16 }}
          href="https://twitter.com/intent/tweet?screen_name=open_ml"
        >
          <FontAwesomeIcon icon={faTwitter} size="lg" />
        </ContactButton>
      </Zoom>
      <Zoom in={true} style={{ transitionDelay: "1000ms" }}>
        <ContactButton
          color="primary"
          size="medium"
          style={{ backgroundColor: purple[500], right: 76 }}
          href="https://join.slack.com/t/openml/shared_invite/enQtODg4NjgzNTE4NjU3LTYwZDFhNzQ5NmE0NjIyNmM3NDMyMjFkZDQ0YWZkYWYxMTIxODFmMDhhMTUzMGYzMmM4NjIzYTZlYjBkOGE5MTQ"
        >
          <FontAwesomeIcon icon={faSlack} size="lg" />
        </ContactButton>
      </Zoom>
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Title variant="h2" align="center">
            {t("about.title")}
          </Title>
        </Grid>
        <Grid item xs={12}>
          <Header
            id="team"
            title={t("about.header.team")}
            icon={faChildReaching}
            color={purple[400]}
          />
          <Card>
            <CardContent>
              <Typography sx={{ pb: 4, pt: 3 }} variant="h5">
                <TitleIcon icon={faUsers} size="lg" color={blue[200]} />
                {t("about.core")}
              </Typography>
              <Typography sx={{ pb: 5 }}>{t("about.core_text")}</Typography>
              <Grid container spacing={6}>
                {people.map(
                  ({ user_id, first_name, last_name, bio, image }) => (
                    <Person
                      key={user_id}
                      id={user_id}
                      name={first_name + " " + last_name}
                      bio={bio}
                      image={image}
                    />
                  )
                )}
                <Person
                  key="0"
                  id="0"
                  name="You?"
                  bio={<Link href="contribute">{t("about.team.join_us")}</Link>}
                  image=""
                />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item display="flex" xs={12} key={contact.id}>
          <InfoCard info={contributors} />
        </Grid>
        <Grid item xs={12}>
          <Header
            id="contact"
            title={t("about.header.contact")}
            icon={faPhoneAlt}
            color={green[500]}
          />
          <InfoCard info={contact} />
        </Grid>
        <Grid item display="flex" xs={12} key={contact_issues.id}>
          <InfoCard info={contact_issues} />
        </Grid>
        <Grid item xs={12}>
          <Header
            id="mission"
            title={t("about.header.mission")}
            icon={faRocket}
            color={grey[200]}
          />
          <InfoCard info={mission} />
        </Grid>
        <Grid item xs={12}>
          <InfoCard info={community} />
        </Grid>
        <Grid item xs={12}>
          <InfoCard info={governance} />
        </Grid>
        <Grid item xs={12}>
          <Header
            id="foundation"
            title={t("about.header.foundation")}
            icon={faHandsHelping}
            color={blue[500]}
          />
          <Card>
            <CardContent>
              <Paragraph>{t("about.foundation.description")}</Paragraph>
              <Typography
                variant="h6"
                align="center"
                style={{ marginBottom: 20 }}
              >
                <ListIcon
                  icon={faHands}
                  size="lg"
                  style={{ color: blue[400] }}
                />
                <br /> {t("about.foundation.mission")}
              </Typography>
              <Paragraph>{t("about.foundation.mission2")}</Paragraph>
            </CardContent>
          </Card>
          <Accordion>
            <AccordionSummary
              expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                <b>{t("about.foundation.board_title")}</b>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{t("about.foundation.board")}</Typography>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Wrapper>
  );
}

About.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default About;
