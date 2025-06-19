import { React, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import { Helmet } from "react-helmet-async";
import { spacing } from "@mui/system";

import DashboardLayout from "../layouts/Dashboard";
import Header from "../components/Header";
import InfoCard from "../components/Card";
import Wrapper from "../components/Wrapper";
import Connector from "../services/SearchAPIConnector";

import {
  Card as MuiCard,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Avatar,
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
  faComments,
  faDove,
  faUserAstronaut,
  faFlagCheckered,
} from "@fortawesome/free-solid-svg-icons";

import {
  faJava,
  faPython,
  faReact,
  faRebel,
  faRProject,
  faSlack,
  faTwitter,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

import { purple, blue, red, green, grey } from "@mui/material/colors";
import { ActionChip } from "../components/Card";

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

import { SearchProvider, Results } from "@elastic/react-search-ui";
import CoreFilter from "../components/search/CoreFilter";

const Card = styled(MuiCard)(spacing);

const Typography = styled(MuiTypography)(spacing);

const FixedTypography = styled(Typography)`
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
  max-height: 53px;
  display: -webkit-box;
  -webkit-line-clamp: 3; /* Limits the number of lines to 3 */
  -webkit-box-orient: vertical;
`;

const ContactButton = styled(Fab)`
  margin: 0;
  top: 85px;
  bottom: auto;
  left: auto;
  position: fixed;
`;

const BigAvatar = styled(Avatar)`
  width: 92px;
  height: 92px;
  text-align: center;
  margin: 0 auto ${(props) => props.theme.spacing(5)}px;
  background-image: linear-gradient(
    to bottom right,
    DeepSkyBlue,
    MediumVioletRed
  );
`;

// Needed to override the default list styling of the search results
const ResultsWrapper = styled("div")({
  ul: {
    display: "flex",
    flexWrap: "wrap",
    paddingLeft: 0,
    listStyleType: "none",
  },
  "ul li": {
    flex: "1 0 calc(25% - 20px)",
    margin: "10px",
  },
});

const Person = ({ result }) => {
  const name = result.first_name.raw + " " + result.last_name.raw;
  const id = result.user_id.raw; //TODO: go to user profile on click
  return (
    <Grid
      size={{
        xs: 12,
        sm: 4,
        md: 3,
        xl: 2,
      }}
    >
      <Grid container direction="column" alignItems="center" sx={{ pb: 5 }}>
        <BigAvatar alt="..." src={result.image.raw} align="center">
          {name.match(/\b(\w)/g).join("")}
        </BigAvatar>
        <Typography
          variant="h6"
          display="block"
          align="center"
          sx={{ pt: 3 }}
          gutterBottom
        >
          {name}
        </Typography>
        <FixedTypography variant="caption" align="center" gutterBottom>
          {result.bio.raw}
        </FixedTypography>
      </Grid>
    </Grid>
  );
};

const AvatarContainer = styled("div")({
  display: "flex",
  marginBottom: "10px",
  cursor: "pointer",
  "& > *": {
    margin: "4px",
  },
  "&:hover": {
    filter: "brightness(85%)",
  },
});

const AvatarLabel = styled("div")({
  display: "flex",
  alignItems: "center",
});

const MiniPerson = ({ result }) => {
  const name = result.login;

  if (name.includes("[bot]")) return <div></div>;

  return (
    <Grid
      size={{
        xs: 6,
        sm: 4,
        md: 3,
        lg: 2,
      }}
    >
      <AvatarContainer onClick={() => window.open(result.html_url, "_blank")}>
        <AvatarLabel>
          <Avatar
            style={{ marginRight: "14px" }}
            alt={name}
            src={result.avatar_url}
          />
          <Typography variant="body2">{name}</Typography>
        </AvatarLabel>
      </AvatarContainer>
    </Grid>
  );
};

const TitleIcon = styled(FontAwesomeIcon)`
  padding-right: 15px;
`;

const Title = styled(Typography)`
  padding-top: 1em;
`;

const contributors = {
  id: "about.contributors",
  icon: faHandHoldingHeart,
  iconColor: red[400],
  chips: [
    {
      link: "https://github.com/openml/openml.org/graphs/contributors",
      icon: faReact,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/OpenML/graphs/contributors",
      icon: faCloud,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-python/graphs/contributors",
      icon: faPython,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-r/graphs/contributors",
      icon: faRProject,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-java/graphs/contributors",
      icon: faJava,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-data/graphs/contributors",
      icon: faDatabase,
      target: "_blank",
    },
    {
      link: "https://github.com/openml/blog/graphs/contributors",
      icon: faBlog,
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

const contact_issues = {
  id: "about.contact_issues",
  icon: faBugSlash,
  iconColor: red[400],
  chips: [
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

const mission = {
  id: "about.mission",
  icon: faDove,
  iconColor: blue[400],
};

const community = {
  id: "about.community",
  icon: faUserAstronaut,
  iconColor: grey[400],
};

const governance = {
  id: "about.governance",
  icon: faUsers,
  iconColor: purple[300],
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

const foundation = {
  id: "about.foundation",
  icon: faRebel,
  iconColor: blue[400],
};

const foundation_mission = {
  id: "about.foundation_mission",
  icon: faFlagCheckered,
  iconColor: grey[400],
};

const apiConnector = new Connector("user");
const coreConfig = {
  apiConnector: apiConnector,
  urlPushDebounceLength: 0,
  trackUrlState: false,
  alwaysSearchOnInitialLoad: true,
  searchQuery: {
    result_fields: {
      user_id: { raw: {} },
      first_name: { raw: {} },
      last_name: { raw: {} },
      bio: { raw: {} },
      image: { raw: {} },
      date: { raw: {} },
    },
    // Both are needed to filter on user_id
    disjunctiveFacets: ["user_id.keyword"],
    facets: {
      "user_id.keyword": { type: "value", size: 30, sort: "count" },
    },
  },
};

function Contributors() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false); // true if contributors couldn't be fetched

  useEffect(() => {
    const fetchData = async () => {
      const repos = [
        "OpenML",
        "openml.org",
        "openml-python",
        "openml-r",
        "openml-java",
        "openml-data",
        "blog",
        "docs",
        "openml-tensorflow",
        "openml-pytorch",
        "benchmark-suites",
        "automlbenchmark",
        "server-api",
      ];

      const responses = await Promise.all(
        repos.map((repo) =>
          fetch(`https://api.github.com/repos/openml/${repo}/contributors`),
        ),
      );

      const validResponses = [];

      for (const res of responses) {
        if (res.ok) {
          validResponses.push(await res.json());
        } else {
          //console.warn("Could not fetch contributors:", await res.json());
          setError(true);
          return;
        }
      }

      const contributorsMap = new Map();

      (validResponses ?? [])
        .filter(Array.isArray)
        .flat()
        .forEach((contributor) => {
          if (contributorsMap.has(contributor.login)) {
            contributorsMap.get(contributor.login).contributions +=
              contributor.contributions;
          } else {
            contributorsMap.set(contributor.login, {
              ...contributor,
              contributions: contributor.contributions,
            });
          }
        });

      const sortedData = Array.from(contributorsMap.values()).sort(
        (a, b) => b.contributions - a.contributions,
      );

      setData(sortedData);
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <Typography mt={4}>
        Oops, could not fetch contributors. Please try again later.
      </Typography>
    );
  }

  return (
    <Grid container spacing={0}>
      {data.map((person) => (
        <MiniPerson result={person} key={person.login} />
      ))}
    </Grid>
  );
}

function About() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <Wrapper>
      <Helmet title={t("about.helmet")} />
      <Zoom in={true} style={{ transitionDelay: "1000ms" }}>
        <ContactButton
          color="primary"
          size="medium"
          style={{ right: 16 }}
          href="https://twitter.com/intent/tweet?screen_name=open_ml"
          target="_blank"
        >
          <FontAwesomeIcon icon={faXTwitter} size="lg" />
        </ContactButton>
      </Zoom>
      <Zoom in={true} style={{ transitionDelay: "1000ms" }}>
        <ContactButton
          color="primary"
          size="medium"
          style={{ backgroundColor: purple[500], right: 76 }}
          href="https://join.slack.com/t/openml/shared_invite/enQtODg4NjgzNTE4NjU3LTYwZDFhNzQ5NmE0NjIyNmM3NDMyMjFkZDQ0YWZkYWYxMTIxODFmMDhhMTUzMGYzMmM4NjIzYTZlYjBkOGE5MTQ"
          target="_blank"
        >
          <FontAwesomeIcon icon={faSlack} size="lg" />
        </ContactButton>
      </Zoom>
      <Grid container spacing={10}>
        <Grid size={12}>
          <Title variant="h2" align="center">
            {t("about.title")}
          </Title>
        </Grid>
        <Grid size={12}>
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
              <Grid container>
                <SearchProvider config={coreConfig}>
                  <CoreFilter />
                  <ResultsWrapper>
                    <Results
                      resultView={Person}
                      titleField="name"
                      urlField="user_id"
                      shouldTrackClickThrough
                    />{" "}
                  </ResultsWrapper>
                </SearchProvider>
              </Grid>
              <ActionChip
                key="join_core"
                link="https://docs.openml.org/Governance/"
                icon={faUsers}
                text={t("about.join_core")}
                target="_blank"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid display="flex" key={contact.id} size={12}>
          <Card>
            <InfoCard info={contributors} />
            <CardContent>
              <Contributors />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={12}>
          <Header
            id="contact"
            title={t("about.header.contact")}
            icon={faPhoneAlt}
            color={green[500]}
          />
          <InfoCard info={contact} />
        </Grid>
        <Grid display="flex" key={contact_issues.id} size={12}>
          <InfoCard info={contact_issues} />
        </Grid>
        <Grid size={12}>
          <Header
            id="mission"
            title={t("about.header.mission")}
            icon={faRocket}
            color={red[400]}
          />
          <InfoCard info={mission} />
        </Grid>
        <Grid size={12}>
          <InfoCard info={community} />
        </Grid>
        <Grid size={12}>
          <InfoCard info={governance} />
        </Grid>
        <Grid size={12}>
          <Header
            id="foundation"
            title={t("about.header.foundation")}
            icon={faHandsHelping}
            color={blue[500]}
          />
          <InfoCard info={foundation} />
        </Grid>
        <Grid size={12}>
          <InfoCard info={foundation_mission} />
          <Accordion>
            <AccordionSummary
              expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                <b>{t("about.foundation_board.title")}</b>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{t("about.foundation_board.text")}</Typography>
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
