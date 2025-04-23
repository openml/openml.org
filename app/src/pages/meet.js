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

const Typography = styled(MuiTypography)(spacing);

const Title = styled(Typography)`
  padding-top: 1em;
`;

const hackathons = {
  id: "meetup.hackathons",
  media: "/static/img/dagstuhl.jpg",
  chips: [
    {
      link: "https://www.flickr.com/photos/159879889@N02",
      icon: faImages,
      target: "_blank",
    },
    {
      link: "#upcoming",
      icon: faCalendarAlt,
    },
    {
      link: "#sponsor",
      icon: faHandHoldingHeart,
    },
  ],
};

const nextEvent = {
  id: "meetup.nextEvent",
  media: "/static/img/dagstuhl.jpg",
  buttons: [
    {
      href: "https://forms.gle/z48UqHt9FYUmz3w88",
    },
    {
      href: "https://www.dagstuhl.de/en/about-dagstuhl/arrival/",
    },
    {
      href: "https://github.com/openml/openml.org/blob/master/meetups.md",
    },
    {
      href: "https://docs.google.com/document/d/1-cjXSqjbce0Gq5zydkp-RNQQmxmcSW4WQ0fWTHUwU9E/edit#",
    },
  ],
};

const sponsorEvent = {
  id: "meetup.sponsorEvent",
  chips: [
    {
      link: "about#contact",
      icon: faPhone,
    },
    {
      link: "about#foundation",
      icon: faHandsHelping,
    },
    {
      link: "about#contact",
      icon: faHandHoldingHeart,
    },
  ],
};

function MeetUp() {
  // When developing, reload i18n resources on page reload
  const { i18n, t } = useTranslation();
  if (process.env.NODE_ENV === "development") {
    i18n.reloadResources();
  }

  return (
    <Wrapper>
      <Helmet title={t("meetup.helmet")} />
      <Grid container spacing={10}>
        <Grid size={12}>
          <Title variant="h2" align="center">
            {t("meetup.title")}
          </Title>
        </Grid>
        <Grid size={12}>
          <Header
            id="meetup"
            title={t("meetup.header.meetup")}
            icon={faCampground}
            color={purple[500]}
          />
          <InfoCard info={hackathons} />
        </Grid>
        <Grid size={12}>
          <Header
            id="upcoming"
            title={t("meetup.header.upcoming")}
            icon={faCalendarAlt}
            color={blue[400]}
          />
          <InfoCard info={nextEvent} />
        </Grid>
        <Grid size={12}>
          <Header
            id="sponsor"
            title={t("meetup.header.sponsor")}
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
