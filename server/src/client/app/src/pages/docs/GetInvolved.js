import React from "react";
import styled from "styled-components";
import { green, red, blue, grey, purple } from "@material-ui/core/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Card as MuiCard,
  Paper,
  CardContent,
  Grid,
  Chip,
  List,
  Typography as MuiTypography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { HashLink } from "react-router-hash-link";

const TopLink = styled(HashLink)({
  color: grey[600],
  marginLeft: 10,
  marginRight: 10,
  textDecoration: "none"
});
const Card = styled(MuiCard)(spacing);

const Typography = styled(MuiTypography)(spacing);

const HeroTitle = styled(Typography)({
  textAlign: "center",
  lineHeight: "150%",
  padding: "2vw 5vw"
});
const HeroSubTitle = styled(Typography)({
  textAlign: "center",
  lineHeight: "150%",
  fontSize: "1.1rem",
  paddingTop: "0.5vw"
});
const Paragraph = styled(Typography)({
  paddingBottom: "2vw"
});

const MainPaper = styled(Paper)`
  flex: 1;
  background: ${props =>
    props.bg === "Gradient" ? "transparent" : props.theme.body.background};
  padding: 40px;
`;
const ListIcon = styled(FontAwesomeIcon)({
  marginLeft: 10,
  marginRight: 10,
  fontWeight: 800
});

const ContactChip = ({ link, icon, text }) => {
  return (
    <Chip
      icon={<ListIcon icon={icon} size="lg" style={{ marginRight: 0 }} />}
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
      icon={<ListIcon icon={icon} size="lg" style={{ marginRight: 0 }} />}
      component="a"
      href={link}
      label={text}
      clickable
      color="secondary"
      style={{
        marginRight: 10,
        marginBottom: 10
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
              marginBottom: 20
            }}
          >
            <TopLink smooth to="/contribute#help">
              Contribute
            </TopLink>
            <TopLink smooth to="/contribute#support">
              Support
            </TopLink>
          </List>
          <HeroTitle variant="h3" align="center">
            Want to get involved?
            <HeroSubTitle>
              <FontAwesomeIcon
                icon="thumbs-up"
                size="lg"
                style={{ color: blue[500] }}
              />
              <br />
              Awesome, we're happy to have you!
            </HeroSubTitle>
          </HeroTitle>
          <Card>
            <CardContent>
              <Paragraph>
                <b>We want to create better AI and machine learning systems</b>,
                and we want to help anybody who has the same goal. We do this by
                making it easier to train and thoroughy test machine learning
                models in an open and collaborative way. Open science is the
                best way to ensure trustworthy AI.
              </Paragraph>
              <Typography variant="h6" gutterBottom>
                You can help us, too!
              </Typography>
              <Typography>
                OpenML is created entirely by many small and large contributions
                from a community of enthousiastic (and smart!) people. You can
                get involved by donating some of your time, your knowledge, or
                even some of your money for the greater good. In return, you get
                a more useful OpenML, more visibility, plus it can be really fun{" "}
                <FontAwesomeIcon
                  icon={["far", "laugh-wink"]}
                  size="lg"
                  style={{ color: green[500] }}
                />
              </Typography>
            </CardContent>
          </Card>
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
              <Card>
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
              <Card>
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
              <Card>
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
              <Card>
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
              <Card>
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
          <HeroTitle variant="h3" align="center" id="support">
            <ListIcon
              icon="hand-holding-usd"
              size="lg"
              style={{ color: green[400], marginTop: 70 }}
            />
            <br />
            Support us financially
          </HeroTitle>
          <Card>
            <CardContent>We'll set up an OpenCollective page here.</CardContent>
          </Card>
        </MainPaper>
      </React.Fragment>
    );
  }
}
