import React from "react";
import styled from "styled-components";
import { green, grey, blue, purple, red } from "@mui/material/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Card as MuiCard,
  Paper,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Button,
  Chip,
  List,
  Typography as MuiTypography,
} from "@mui/material";

import { spacing } from "@mui/system";
import { HashLink } from "react-router-hash-link";

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

const ContactChip = ({ link, icon, text }) => {
  return (
    <Chip
      icon={<ListIcon icon={icon} size="lg" style={{ marginRight: 0 }} />}
      component="a"
      href={link}
      label={text}
      target="_blank"
      clickable
      color="primary"
      variant="outlined"
      style={{ marginRight: 10 }}
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
            <TopLink smooth to="/meet#meetup">
              Our hackathons
            </TopLink>
            <TopLink smooth to="/meet#upcoming">
              Upcoming events
            </TopLink>
            <TopLink smooth to="/meet#sponsor">
              Sponsor an event
            </TopLink>
          </List>
          <HeroTitle variant="h3" align="center" id="meetup">
            Let's meet up!
            <HeroSubTitle>
              <FontAwesomeIcon
                icon="campground"
                size="lg"
                style={{ color: purple[400] }}
              />
              <br />
              Join one of our hackathons
            </HeroSubTitle>
          </HeroTitle>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Changing the world requires focussed, deep work
              </Typography>
              <Typography style={{ paddingBottom: 20 }}>
                In hackathon-style events, we break away from routine and work
                for entire weeks on new ideas that push the scientific community
                forward. From building cool extensions of OpenML itself to
                solving data-driven problems in novel ways, we believe in open
                science and democritizing machine learning for everyone. Just
                bring your laptop, we take care of drinks, snacks, focussed
                time, and great company{" "}
                <FontAwesomeIcon
                  icon={["far", "laugh-wink"]}
                  size="lg"
                  style={{ color: green[500] }}
                />
                .
              </Typography>
              <List component="nav">
                <ContactChip
                  link="https://www.flickr.com/photos/159879889@N02"
                  icon="images"
                  text="Check out pictures from previous events"
                />
              </List>
            </CardContent>
          </Card>

          <HeroTitle variant="h3" align="center" id="upcoming">
            <ListIcon
              icon="calendar-alt"
              size="lg"
              style={{ color: blue[400], marginTop: 70 }}
            />
            <br />
            Upcoming events
          </HeroTitle>
          <Card>
            <CardActionArea>
              <CardMedia
                style={{ height: 240 }}
                image="https://www.holland.com/upload_mm/7/2/d/68530_fullimage_leiden_canals.jpg"
                title="Hackathon"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  2025 Winter Hackathon - December/January - Leiden University,
                  Leiden, The Netherlands
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Join us at Leiden University to work on the next generation of
                  OpenML. The dates are still being explored, but most likely
                  end of December or early January. Join our Slack channel to
                  join the discussion.
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" color="primary" href="">
                Registration (free)
              </Button>
              <Button size="small" color="primary" href="">
                Schedule and more
              </Button>
              <Button
                size="small"
                color="primary"
                href="https://github.com/openml/openml.org/blob/master/meetups.md"
              >
                Prepare
              </Button>
            </CardActions>
          </Card>
          <HeroTitle variant="h3" align="center" id="sponsor">
            <ListIcon
              icon="hand-holding-heart"
              size="lg"
              style={{ color: red[400], marginTop: 70 }}
            />
            <br />
            Sponsor an event
          </HeroTitle>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Sponsoring can turn a great hackathon into an awesome one!
              </Typography>
              <Typography style={{ paddingBottom: 20 }}>
                We are always very happy with sponsorship to make the next
                hackathon even better. Sponsoring an event can be done through
                the OpenML Foundation and will be used directly for the benefit
                of the participants: to provide snacks, social activities, free
                stuff (e.g. t-shirts),... We'd be happy to acknowledge your
                support on the OpenML website, and invite you to give a
                presentation at the event.
              </Typography>
              <List component="nav">
                <ContactChip
                  link="about#contact"
                  icon="phone"
                  text="Contact us"
                />
                <ContactChip
                  link="about#foundation"
                  icon="hands-helping"
                  text="OpenML Foundation"
                />
              </List>
            </CardContent>
          </Card>
        </MainPaper>
      </React.Fragment>
    );
  }
}
