import React from "react";
import styled from "@emotion/styled";
import { Helmet } from "react-helmet-async";
import { spacing } from "@mui/system";

import DashboardLayout from "../layouts/Dashboard";
import Header from "../components/Header";
import Wrapper from "../components/Wrapper";
import InfoCard from "../components/Card";

import { Grid, Typography as MuiTypography } from "@mui/material";
import {
  faCampground,
  faCalendarAlt,
  faHandHoldingHeart,
  faImages,
  faPhone,
  faHandsHelping,
} from "@fortawesome/free-solid-svg-icons";
import { purple, blue, red } from "@mui/material/colors";

const Typography = styled(MuiTypography)(spacing);

const Title = styled(Typography)`
  padding-top: 1em;
`;

const hackathons = {
  media: "/static/img/dagstuhl.jpg",
  title: "Changing the world requires focussed, deep work",
  text: "In hackathon-style events, we break away from routine and work for entire weeks on new ideas that push the scientific community forward. From building cool extensions of OpenML itself to solving machine learning problems in entirely new ways, we believe in open science and democritizing machine learning for everyone. Just bring your laptop, we take care of drinks, snacks, focussed time, and great company",
  chips: [
    {
      link: "https://www.flickr.com/photos/159879889@N02",
      icon: faImages,
      text: "See pictures from previous events",
      target: "_blank",
    },
    {
      link: "#upcoming",
      icon: faCalendarAlt,
      text: "Upcoming events",
    },
    {
      link: "#sponsor",
      icon: faHandHoldingHeart,
      text: "Sponsor an event",
    },
  ],
};

const nextEvent = {
  media: "/static/img/dagstuhl.jpg",
  title:
    "2022 Spring Hackathon - 20-25 March, Schloss Dagstuhl, Wadern, Germany",
  text: "Join us in Dagstuhl Castle, a wonderful location for advancing computer science research in the hills of Saarland, to work on the next generation of OpenML.",
  buttons: [
    {
      text: "Register (free)",
      href: "https://forms.gle/z48UqHt9FYUmz3w88",
    },
    {
      text: "Getting there",
      href: "https://www.dagstuhl.de/en/about-dagstuhl/arrival/",
    },
    {
      text: "Prepare",
      href: "https://github.com/openml/openml.org/blob/master/meetups.md",
    },
    {
      text: "Schedule",
      href: "https://docs.google.com/document/d/1-cjXSqjbce0Gq5zydkp-RNQQmxmcSW4WQ0fWTHUwU9E/edit#",
    },
  ],
};

const sponsorEvent = {
  title: "Sponsoring can turn a great hackathon into an awesome one!",
  text: "We are always very happy with sponsorship to make the next hackathon even better. Sponsoring an event can be done through the OpenML Foundation and will be used directly for the benefit of the participants: to provide snacks, social activities, free stuff (e.g. t-shirts),... We'd be happy to acknowledge your support on the OpenML website, and invite you to give a presentation at the event.",
  chips: [
    {
      text: "Contact us",
      link: "about#contact",
      icon: faPhone,
    },
    {
      text: "OpenML Foundation",
      link: "about#foundation",
      icon: faHandsHelping,
    },
    {
      text: "Other ways to sponsor",
      link: "about#contact",
      icon: faHandHoldingHeart,
    },
  ],
};

function MeetUp() {
  return (
    <Wrapper>
      <Helmet title="Meet OpenML!" />
      <Grid container spacing={10}>
        <Grid item xs={12}>
          <Title variant="h2" align="center">
            Let's meet up!
          </Title>
        </Grid>
        <Grid item xs={12}>
          <Header
            id="meetup"
            title="Join one of our hackathons"
            icon={faCampground}
            color={purple[500]}
          />
          <InfoCard info={hackathons} />
        </Grid>
        <Grid item xs={12}>
          <Header
            id="upcoming"
            title="Upcoming events"
            icon={faCalendarAlt}
            color={blue[400]}
          />
          <InfoCard info={nextEvent} />
        </Grid>
        <Grid item xs={12}>
          <Header
            id="sponsor"
            title="Sponsor an event"
            icon={faHandHoldingHeart}
            color={red[400]}
          />
          <InfoCard info={sponsorEvent} />
        </Grid>
      </Grid>
    </Wrapper>
  );
}

MeetUp.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default MeetUp;
