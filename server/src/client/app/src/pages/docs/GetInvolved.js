import React from "react";
import styled from "styled-components";
import {
  yellow,
  green,
  red,
  blue,
  orange,
  grey,
  purple,
} from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card as MuiCard,
  Paper,
  CardContent,
  Grid,
  Chip,
  Fab,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography as MuiTypography,
  Zoom,
} from "@mui/material";

import { spacing } from "@mui/system";
import { HashLink } from "react-router-hash-link";
import { animated } from "@react-spring/web";
import useBoop from "../../components/Boop.js";

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
      {/* Child can be anything */}
      <FontAwesomeIcon icon="dove" size="lg" />
    </animated.div>
  );
};

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const ContactButton = styled(Fab)({
  margin: 0,
  top: 85,
  bottom: "auto",
  left: "auto",
  position: "fixed",
});

const TopLink = styled(HashLink)({
  color: grey[600],
  marginLeft: 10,
  marginRight: 10,
  textDecoration: "none",
});
const Card = styled(MuiCard)(spacing);

const Typography = styled(MuiTypography)(spacing);

const HeroTitle = styled(Typography)({
  textAlign: "center",
  lineHeight: "150%",
  padding: "2vw 5vw",
});
const HeroSubTitle = styled(Typography)({
  textAlign: "center",
  lineHeight: "150%",
  fontSize: "1.1rem",
  paddingTop: "0.5vw",
});
const Paragraph = styled(Typography)({
  paddingBottom: "2vw",
});

const MainPaper = styled(Paper)`
  flex: 1;
  background: ${(props) =>
    props.bg === "Gradient" ? "transparent" : props.theme.body.background};
  padding: 40px;
`;
const ListIcon = styled(FontAwesomeIcon)({
  marginLeft: 10,
  marginRight: 10,
  fontWeight: 800,
});

const ContactLink = ({ link, icon, color, text }) => {
  return (
    <ListItemLink button href={link}>
      <ListItemIcon>
        <ListIcon icon={icon} size="2x" style={{ color: color }} />
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

export const ContactChipFull = ({ link, icon, text }) => {
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
      color="secondary"
      style={{
        marginRight: 10,
        marginBottom: 10,
      }}
    />
  );
};

export default class GetInvolved extends React.Component {
  componentDidMount() {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");
      const element = document.getElementById(id);
      element.scrollIntoView();
    }
  }

  render() {
    return (
      <React.Fragment>
        <MainPaper>
          <List
            component="nav"
            style={{
              marginTop: -10,
              marginBottom: 20,
            }}
          >
            <TopLink smooth to="/contribute">
              How you can help
            </TopLink>
            <TopLink smooth to="/contribute#help">
              Contributing
            </TopLink>
            <TopLink smooth to="/contribute#sponsor">
              Sponsorship
            </TopLink>
          </List>
          <Zoom in={true} style={{ transitionDelay: "1000ms" }}>
            <ContactButton
              color="secondary"
              size="medium"
              style={{ right: 16 }}
              href="https://opencollective.com/openml"
              target="_blank"
            >
              <FontAwesomeIcon icon="donate" size="lg" />
            </ContactButton>
          </Zoom>
          <HeroTitle variant="h3" align="center">
            <OpenMLDove color={red[500]} />
            <OpenMLDove color={yellow[800]} />
            <OpenMLDove color={green[500]} />
            <OpenMLDove color={blue[500]} />
            <HeroSubTitle style={{ paddingTop: 20 }}>
              Here's to the crazy ones. The open science rebels.
              <br />
              The ones who believe that machine learning should be set free.
              <br />
              They're not fond of the hype, and they have no respect for
              irreproducible results.
              <br />
              They believe that with openness, we can push the human race
              forward.
              <br />
              Because by combining the best data, tools, methods, and ideas,
              <br />
              we can change the world, together.
            </HeroSubTitle>
          </HeroTitle>
          <Card>
            <CardContent>
              <Typography variant="h4" gutterBottom display="block">
                Contributing
              </Typography>
              <Paragraph>
                The people who contribute to OpenML do so for the love of
                machine learning and because they want to help build a more
                inclusive and frictionless ecosystem of data, tools and clear
                results. You can contribute in different ways:
              </Paragraph>
              <List
                component="nav"
                style={{ marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
              >
                <ContactLink
                  icon="hand-holding-heart"
                  link="contribute#help"
                  color={red[500]}
                  text="Help us improve the OpenML platform and interfaces."
                />
                <ContactLink
                  icon="hand-holding-usd"
                  link="contribute#sponsor"
                  color={green[500]}
                  text="Make a donation to support our community and keep OpenML free."
                />
                <ContactLink
                  icon="hand-holding-medical"
                  link="contribute#help"
                  color={blue[500]}
                  text="Share new interesting datasets, models, and experiments."
                />
              </List>
            </CardContent>
          </Card>
          <Grid container spacing={4} style={{ marginTop: 20 }}>
            <Grid item style={{ display: "flex" }} xs={12} md={6} lg={3}>
              <Card style={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom my={4}>
                    <ListIcon
                      icon="users-cog"
                      size="lg"
                      style={{ color: red[400], marginRight: 20 }}
                    />
                    Are you a developer?
                  </Typography>
                  <Paragraph style={{ paddingBottom: 0 }}>
                    We want to make OpenML ridiculously easy to use and
                    empowering.{" "}
                    <Link href="contribute#help">
                      Contribute your skill and expertise
                    </Link>{" "}
                    to make OpenML better for you and others, either online (on
                    GitHub) or during one of our coding sprints. You can also
                    help by telling your employer about us.
                  </Paragraph>
                </CardContent>
              </Card>
            </Grid>
            <Grid item style={{ display: "flex" }} xs={12} md={6} lg={3}>
              <Card style={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom my={4}>
                    <ListIcon
                      icon="user-astronaut"
                      size="lg"
                      style={{ color: orange[700], marginRight: 20 }}
                    />
                    Are you a scientist?
                  </Typography>
                  <Paragraph style={{ paddingBottom: 0 }}>
                    We want to empower people to change the world for the
                    better. You can help by contributing useful datasets and
                    machine learning pipelines, or by{" "}
                    <Link href="contribute#help">
                      extending OpenML to make it more useful in science and
                      discovery
                    </Link>
                    .
                  </Paragraph>
                </CardContent>
              </Card>
            </Grid>
            <Grid item style={{ display: "flex" }} xs={12} md={6} lg={3}>
              <Card style={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom my={4}>
                    <ListIcon
                      icon="seedling"
                      size="lg"
                      style={{ color: green[800], marginRight: 20 }}
                    />
                    <b>Do you want to help?</b>
                  </Typography>
                  <Paragraph style={{ paddingBottom: 0 }}>
                    OpenML depends on all of us. You can help keep OpenML free
                    and support our community by{" "}
                    <Link href="contribute#sponsor">making a donation</Link> (no
                    pressure). You can also join us at an OpenML event, or
                    organize one yourself! Or maybe you have another great idea?
                    Please don't hesitate to reach out!
                  </Paragraph>
                </CardContent>
              </Card>
            </Grid>
            <Grid item style={{ display: "flex" }} xs={12} md={6} lg={3}>
              <Card style={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom my={4}>
                    <ListIcon
                      icon="user-tie"
                      size="lg"
                      style={{ color: blue[400], marginRight: 20 }}
                    />
                    Are you an executive?
                  </Typography>
                  <Paragraph style={{ paddingBottom: 0 }}>
                    OpenML helps your team to discover machine learning assets
                    and automate processes, so that they can focus on what
                    matters. You can encourage your developers to help out, host
                    a coding sprint,{" "}
                    <Link href="contribute#sponsor">
                      become an official sponsor
                    </Link>
                    , or <Link href="contribute#sponsor">partner with us</Link>.
                    We'd love to work with you!
                  </Paragraph>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <HeroTitle variant="h3" align="center" id="help">
            <ListIcon
              icon="hand-holding-heart"
              size="lg"
              style={{ color: red[400], marginTop: 70 }}
            />
            <br />
            Contribute to OpenML
          </HeroTitle>
          <Grid container spacing={4}>
            <Grid item style={{ display: "flex" }} xs={12} sm={6} lg={4}>
              <Card style={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom my={4}>
                    <ListIcon
                      icon="code"
                      size="lg"
                      style={{ color: blue[400], marginRight: 20 }}
                    />
                    <b>Do you know how to code?</b>
                    <br />
                    <br />
                    Perfect! Please see the issue trackers of the different
                    OpenML components that you can contribute to.
                  </Typography>
                  <List component="nav">
                    <ContactChipFull
                      link="https://docs.openml.org/Website/"
                      icon="book-open"
                      text="Developer docs"
                    />
                    <ContactChip
                      link="https://github.com/openml/openml.org/issues"
                      icon={["fab", "react"]}
                      text="Website"
                    />
                    <ContactChip
                      link="https://github.com/openml/OpenML/issues"
                      icon={["fas", "cloud"]}
                      text="REST API"
                    />
                    <ContactChip
                      link="https://github.com/openml/openml-python/issues"
                      icon={["fab", "python"]}
                      text="Python API"
                    />
                    <ContactChip
                      link="https://github.com/openml/openml-r/issues"
                      icon={["fab", "r-project"]}
                      text="R API"
                    />
                    <ContactChip
                      link="https://github.com/openml/openml-java/issues"
                      icon={["fab", "java"]}
                      text="Java API"
                    />
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item style={{ display: "flex" }} xs={12} sm={6} lg={4}>
              <Card style={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom my={4}>
                    <ListIcon
                      icon={["fab", "sketch"]}
                      size="lg"
                      style={{ color: purple[400], marginRight: 20 }}
                    />
                    <b>Good at web design / UX?</b>
                    <br />
                    <br />
                    Please help us improve the website to make it nicer and more
                    intuitive for everyone.
                  </Typography>
                  <List component="nav">
                    <ContactChipFull
                      link="https://docs.openml.org/Website/"
                      icon="book-open"
                      text="Website docs"
                    />
                    <ContactChip
                      link="https://github.com/openml/openml.org/issues"
                      icon={["fab", "github"]}
                      text="Website code and issues"
                    />
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item style={{ display: "flex" }} xs={12} sm={6} lg={4}>
              <Card style={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom my={4}>
                    <ListIcon
                      icon="book-reader"
                      size="lg"
                      style={{ color: red[800], marginRight: 20 }}
                    />
                    <b>Care to help with documentation?</b>
                    <br />
                    <br />
                    OpenML should be easy to understand for everyone. Please
                    help us improve the documentation whenever something is not
                    100% clear.
                  </Typography>
                  <List component="nav">
                    <ContactChipFull
                      link="https://docs.openml.org"
                      icon="book-open"
                      text="OpenML Docs"
                    />
                    <ContactChip
                      link="https://docs.openml.org/OpenML-Docs/"
                      icon={["fab", "github"]}
                      text="How to update the docs"
                    />
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item style={{ display: "flex" }} xs={12} sm={6} lg={4}>
              <Card style={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom my={4}>
                    <ListIcon
                      icon="database"
                      size="lg"
                      style={{ color: green[400], marginRight: 20 }}
                    />
                    <b>Do you care about good datasets?</b>
                    <br />
                    <br />
                    High quality datasets are crucial for machine learning.
                    Please add new interesting datasets or help check the
                    quality of the existing ones.
                  </Typography>
                  <List component="nav">
                    <ContactChip
                      link="https://github.com/openml/openml-data/issues"
                      icon={["fab", "github"]}
                      text="Dataset issue tracker"
                    />
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item style={{ display: "flex" }} xs={12} sm={6} lg={4}>
              <Card style={{ width: "100%" }}>
                <CardContent>
                  <Typography variant="body1" gutterBottom my={4}>
                    <ListIcon
                      icon="users"
                      size="lg"
                      style={{ color: red[200], marginRight: 20 }}
                    />
                    <b>Help us build a stronger community</b>
                    <br />
                    <br />
                    Become an OpenML ambassador! Help us make OpenML better
                    known in your community, write about OpenML and how you use
                    it, or give us shout-out.
                  </Typography>
                  <List component="nav">
                    <ContactChip
                      link="https://openml.github.io/blog"
                      icon={["fas", "blog"]}
                      text="OpenML blog"
                    />
                    <ContactChip
                      link="https://twitter.com/open_ml"
                      icon={["fab", "twitter"]}
                      text="OpenML on Twitter"
                    />
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <HeroTitle variant="h3" align="center" id="sponsor">
            <ListIcon
              icon={["fab", "angellist"]}
              size="lg"
              style={{ color: blue[500], marginTop: 40 }}
            />
            <br />
            Support the OpenML community
          </HeroTitle>
          <Card>
            <CardContent>
              <Paragraph>
                Hi, we could use your help. By making a small donation, you help
                us run coding sprints and outreach activities, keep our
                community happy and engaged, and ensure that we have the basic
                infrastructure to keep the platform free for everyone. Also, if
                OpenML sometimes sucks, we promise to do better! We use the{" "}
                <Link href="https://opencollective.com/openml">
                  Open Collective
                </Link>{" "}
                model to accept donations, so we can celebrate you in our hall
                of fame as an official backer, and be fully transparent on how
                your contributions are used to support OpenML. Please click the
                button below. Thank you so much!
              </Paragraph>
              <Paragraph style={{ paddingBottom: 0 }}>
                <a
                  href="https://opencollective.com/openml"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="https://opencollective.com/openml/donate/button@2x.png?color=blue"
                    width="265"
                    alt="OpenCollective button"
                  />
                </a>
              </Paragraph>
            </CardContent>
          </Card>
          <HeroTitle variant="h3" align="center" id="sponsor">
            <ListIcon
              icon="hands-helping"
              size="lg"
              style={{ color: blue[500], marginTop: 40 }}
            />
            <br />
            Call for Sponsorship
          </HeroTitle>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Why sponsor us?
              </Typography>
              <Paragraph>
                Simply put, without our generous sponsors, OpenML would not be
                able to make all its resources and services available{" "}
                <b>for free</b> to the entire world. By donating to OpenML you
                further the project's mission to democratize machine learning
                research. Your donations will be used to run engaging community
                events (which require venues, catering and thank-you packages),
                to enable internships, and to maintain and improve our platform
                services, which requires compute and storage infrastructure, as
                well as technical development and maintenance. With your
                support, we can bring OpenML to the next level, together!
              </Paragraph>
              <Typography variant="h5" gutterBottom>
                How do you want to work with us?
              </Typography>
              <Paragraph style={{ paddingBottom: 0 }}>
                We are open to many forms of sponsorship, both in kind and in
                cash. Rather than providing fixed sponsorship levels, we would
                love to hear from you and learn how we could better align with
                your goals. Below are examples of possible benefits, but we are
                open to new ideas to collaborate with you.
              </Paragraph>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <ListIcon
                      icon="medal"
                      size="2x"
                      style={{ color: purple[700], marginRight: 20 }}
                      fixedWidth
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Your logo on our website and in our presentations"
                    secondary="Included in all sponsorships, but more prominent for larger sponsors"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ListIcon
                      icon="tshirt"
                      size="2x"
                      style={{ color: purple[700], marginRight: 20 }}
                      fixedWidth
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="We will send you OpenML T-shirts, stickers,..."
                    secondary="Or you can send us materials to hand out at our events"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ListIcon
                      icon="comments"
                      size="2x"
                      style={{ color: purple[700], marginRight: 20 }}
                      fixedWidth
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="We will mention your support in talks and videos"
                    secondary="We'll work with you to get the right message across"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ListIcon
                      icon="glass-cheers"
                      size="2x"
                      style={{ color: purple[700], marginRight: 20 }}
                      fixedWidth
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Come give a talk at one of our coding sprints or events"
                    secondary="Or simply come to work together with us"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ListIcon
                      icon="lightbulb"
                      size="2x"
                      style={{ color: purple[700], marginRight: 20 }}
                      fixedWidth
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="New features!"
                    secondary="Let us know what you would like to see, and we'll realize it together"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <ListIcon
                      icon="hands-helping"
                      size="2x"
                      style={{ color: purple[700], marginRight: 20 }}
                      fixedWidth
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Become a partner"
                    secondary="If you support one full time developer (anywhere), you can help shape the future of OpenML"
                  />
                </ListItem>
              </List>
              <Typography variant="h1" gutterBottom my={4}>
                <ContactChipFull
                  link="mailto:openmlhq@googlegroups.com"
                  icon="envelope"
                  text="Get in touch"
                  style={{ backgroundColor: purple[700], marginRight: 20 }}
                />
              </Typography>
              <Typography variant="h5" gutterBottom>
                Where can I make a donation?
              </Typography>
              <Paragraph>
                We use the{" "}
                <Link href="https://opencollective.com/openml">
                  Open Collective
                </Link>{" "}
                model to accept sponsorships. Click the button below to get
                started. All sponsors and the amount of sponsoring are
                acknowledged in our hall of fame, and we'll be fully transparent
                on how your sponsorship makes OpenML better every day. This
                collective is fiscally hosted by our not-for-profit{" "}
                <Link href="about#foundation">
                  Open Machine Learning Foundation
                </Link>
                . If preferred, you can also donate directly to the Foundation.
              </Paragraph>
              <Paragraph style={{ paddingBottom: 10 }}>
                <a
                  href="https://opencollective.com/openml"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="https://opencollective.com/openml/donate/button@2x.png?color=blue"
                    width="265"
                    alt="OpenCollective button"
                  />
                </a>
              </Paragraph>
              <Paragraph style={{ paddingBottom: 0 }}>Thank you!</Paragraph>
            </CardContent>
          </Card>
        </MainPaper>
      </React.Fragment>
    );
  }
}
