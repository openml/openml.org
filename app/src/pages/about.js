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
  Chip,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Avatar,
  Badge,
  List,
  Fab,
  Zoom,
  Typography as MuiTypography,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingHeart,
  faUsers,
  faHandsHelping,
  faCloud,
  faDatabase,
  faBlog,
  faChevronDown,
  faRocket,
  faChild,
  faPhoneAlt,
  faEnvelope,
  faHands,
} from "@fortawesome/free-solid-svg-icons";

import {
  faJava,
  faPython,
  faReact,
  faRProject,
  faSlack,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import { purple, blue, red, yellow, green, orange } from "@mui/material/colors";

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

const MainPaper = styled(Paper)``;

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

const ContactLink = ({ link, icon, color, text }) => {
  return (
    <ListItemLink button href={link}>
      <ListItemIcon>
        <ListIcon icon={icon} size="lg" style={{ color: color }} />
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </ListItemLink>
  );
};

const ContactChip = ({ link, icon, text }) => {
  return (
    <Chip
      icon={
        <ListIcon
          icon={icon}
          size="lg"
          style={{ marginLeft: 10, marginRight: 0 }}
        />
      }
      component="a"
      href={link}
      label={text}
      clickable
      color="primary"
      variant="outlined"
      style={{ marginRight: 10, marginBottom: 10 }}
    />
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

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const Title = styled(Typography)`
  padding-top: 1em;
`;

const mission = {
  title:
    "Machine learning research should be open, well-organized and accessible to anyone.",
  text: `There is amazing machine learning research going on every day in
            labs all over the world. What if we could easily share the latest
            great results (datasets, code, experiments) from all of our labs and
            organize them online, so that everyone can easily discover and
            access them, use them in myriad unexpected ways, and solve problems
            together on a global scale? \n\n
            We strive to make as many datasets as possible easily discoverable,
            well documented, and frictionlessly accessible. When new models are
            trained and evaluated, we also make these results easily
            discoverable, clearly documented and reproducible, so that we can
            trust them, learn from them, and build on the combined results of
            the planet. And of course, we use machine learning on top of all
            this data to make new discoveries and automate our work.
            `,
};

const community = {
  title: "From the ML community for the ML community.",
  text: `
  We want to build the tools that we ourselves like to use, that
  empower us as researchers, and make our lives easier. 
Built around open interfaces, OpenML can be used to
<b>automatically</b> share (and import) datasets, algorithms, and
experiments results straight from the tools that we already know and
love. Through our APIs, OpenML can be easily integrated into new
workflows and processes, to import new data and export new results.
We also believe in great standards for collecting and sharing data
and for collecting and analysing experimental results.
            `,
};

const governance = {
  title: "From the ML community for the ML community.",
  text: `
  OpenML is being built by an awesome open source community. All code
  of the OpenML project carries the BSD-3 Clause licence. Anyone with
  an interest in the project can join the community, contribute to the
  project design, and participate in the decision making process, as
  well as meetings (e.g. hackathons) and online discussions. Dedicated
  contributors can be nominated to become core members, trusted to
  develop and maintain OpenML with care. Core members, in turn, can be
  nominated for the steering committee, and keep the project running
  smoothly with the help of the Open Machine Learning Foundation.
            `,
  chips: [
    {
      text: "Contribution guide",
      link: "https://docs.openml.org/Contributing/",
      icon: faHandHoldingHeart,
    },
    {
      text: "Governance model",
      link: "https://docs.openml.org/Governance/",
      icon: faUsers,
    },
    {
      text: "Open Machine Learning Foundation",
      link: "/about#foundation",
      icon: faHandHoldingHeart,
    },
  ],
};

const ELASTICSEARCH_SERVER = "https://www.openml.org/es/";

function search(type, fields, filter) {
  let params = {
    from: 0,
    size: 50,
    query: {
      bool: {
        filter: [].concat(filter),
      },
    },
    _source: fields.filter((l) => !!l),
  };
  return fetch(
    ELASTICSEARCH_SERVER + type + "/" + type + "/_search?type=" + type,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      mode: "cors",
      body: JSON.stringify(params),
    }
  )
    .then((request) => request.json())
    .then((data) => {
      return data["hits"]["hits"].map((x) => {
        let source = x["_source"];
        let res = {};
        fields.forEach((field) => {
          res[field] = source[field];
        });
        return res;
      });
    });
}

function About() {
  let people = [];

  search("user", ["user_id", "first_name", "last_name", "bio", "image"], {
    terms: { user_id: core_ids.concat(active_ids).concat(contributor_ids) },
  })
    .then((data) => {
      people = data.sort(orderList);
      console.log(people);
    })
    .catch((error) => {
      console.error(error);
    });

  console.log(people);

  return (
    <Wrapper>
      <Helmet title="About OpenML" />
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
            About OpenML
          </Title>
        </Grid>
        <Grid item xs={12}>
          <Header
            id="mission"
            title="Mission"
            icon={faRocket}
            color={purple[500]}
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
            id="mission"
            title="Meet the team"
            icon={faChild}
            color={purple[400]}
          />
          <Card>
            <CardContent>
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
                  bio={<a href="contribute">Join us, get involved!</a>}
                  image=""
                />
              </Grid>
              <Typography variant="body1" gutterBottom my={4}>
                <b>
                  We are infinitely grateful to the many contributors who helped
                  in small or big ways.
                </b>{" "}
                Check out the contributors for each sub-project:
              </Typography>
              <List component="nav">
                <ContactChip
                  link="https://github.com/openml/openml.org#contributors-"
                  icon={faReact}
                  text="OpenML website"
                />
                <ContactChip
                  link="https://github.com/openml/OpenML#contributors-"
                  icon={faCloud}
                  text="OpenML REST API"
                />
                <ContactChip
                  link="https://github.com/openml/openml-python#contributors-"
                  icon={faPython}
                  text="Python API"
                />
                <ContactChip
                  link="https://github.com/openml/openml-r#contributors-"
                  icon={faRProject}
                  text="R API"
                />
                <ContactChip
                  link="https://github.com/openml/openml-java#contributors-"
                  icon={faJava}
                  text="Java API"
                />
                <ContactChip
                  link="https://github.com/openml/openml-data#contributors-"
                  icon={faDatabase}
                  text="Datasets"
                />
                <ContactChip
                  link="https://github.com/openml/blog#contributors-"
                  icon={faBlog}
                  text="Blog"
                />
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <HeroTitle variant="h3" align="center" id="contact">
            <ListIcon
              icon={faPhoneAlt}
              size="lg"
              style={{ color: green[400], marginTop: 70 }}
            />
            <br />
            Contact us
          </HeroTitle>
          <Card>
            <CardContent>
              <List component="nav">
                <ContactLink
                  link="mailto:openmlhq@googlegroups.com"
                  icon={faEnvelope}
                  color={green[400]}
                  text="For general questions about the OpenML initiative, email us at openmlhq@googlegroups.com"
                />
                <ContactLink
                  link="https://twitter.com/intent/tweet?screen_name=open_ml&text=%23openml.org"
                  icon={faTwitter}
                  color={blue[400]}
                  text="Using Twitter? Follow, DM, or tweet to @open_ml"
                />
                <ContactLink
                  link="https://join.slack.com/t/openml/shared_invite/enQtODg4NjgzNTE4NjU3LTYwZDFhNzQ5NmE0NjIyNmM3NDMyMjFkZDQ0YWZkYWYxMTIxODFmMDhhMTUzMGYzMmM4NjIzYTZlYjBkOGE5MTQ"
                  icon={faSlack}
                  color={red[400]}
                  text="Want to be involved in current discussions? Join us on Slack."
                />
              </List>
              <Typography variant="body1" gutterBottom my={4}>
                <b>Did you run into an issue?</b> Want to request a feature or
                do a pull request? Please check the corresponding issue tracker
                on GitHub for solutions or reporting new issues.
              </Typography>
              <List component="nav">
                <ContactChip
                  link="https://github.com/openml/openml.org/issues"
                  icon={faReact}
                  text="OpenML website"
                />
                <ContactChip
                  link="https://github.com/openml/OpenML/issues"
                  icon={faCloud}
                  text="OpenML REST API"
                />
                <ContactChip
                  link="https://github.com/openml/openml-python/issues"
                  icon={faPython}
                  text="Python API"
                />
                <ContactChip
                  link="https://github.com/openml/openml-r/issues"
                  icon={faRProject}
                  text="R API"
                />
                <ContactChip
                  link="https://github.com/openml/openml-java/issues"
                  icon={faJava}
                  text="Java API"
                />
                <ContactChip
                  link="https://github.com/openml/openml-data/issues"
                  icon={faDatabase}
                  text="Datasets"
                />
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <HeroTitle variant="h3" align="center" id="foundation">
            <ListIcon
              icon={faHandsHelping}
              size="lg"
              style={{ color: blue[400], marginTop: 70 }}
            />
            <br />
            The Open Machine Learning Foundation
          </HeroTitle>
          <Card>
            <CardContent>
              <Paragraph>
                The <b>Open Machine Learning Foundation</b> is a not-for-profit
                organization supporting, but not controlling, the OpenML
                project. We are open to collaborate and engage with
                universities, companies, or anyone sharing the same goals and
                willing to support the project. This can involve sponsorship,
                the co-development of new features, or other forms of
                partnership, insofar they align with the Foundation's mission
                and do not affect the independence of the OpenML open source
                project itself.
              </Paragraph>
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
                <br /> <b>Our mission</b> <br /> is to make machine learning
                simple, accessible, collaborative and open
              </Typography>
              <Paragraph>
                ... to enhance and streamline machine learning research,
                education and skillful practice. The foundation aims to achieve
                this mission by, among others, supporting the OpenML.org
                platform to offer a worldwide community the means to openly
                share and build upon each other’s work, enhancing collaboration,
                education, scholarship, openness of data and code, automation of
                processes, and reproducibility of results. We do this in close
                collaboration with the OpenML community and in accordance with
                the guiding principles of the OpenML platform, such as the code
                of honor and the citation policy. More generally, we aim to
                provide the infrastructure, data, code, and scientific
                foundations necessary to accelerate research for the general
                benefit of society and to create positive outcomes for future
                generations.
              </Paragraph>
            </CardContent>
          </Card>
          <Accordion>
            <AccordionSummary
              expandIcon={<FontAwesomeIcon icon={faChevronDown} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>
                <b>Foundation Board</b>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                We want to make sure that the money that the foundation receives
                is invested for the interest of the community. For this purpose,
                we have a board that supervises the activity of the foundation.
                Core contributors to the OpenML project can serve on this board,
                to make decisions on behalf of the community. The current board
                members are Joaquin Vanschoren, Jan van Rijn, Matthias Feurer,
                Bernd Bischl, Heidi Seibold, and Giuseppe Casalicchio.
              </Typography>
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
