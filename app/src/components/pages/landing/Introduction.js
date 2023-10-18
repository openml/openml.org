import React from "react";
import { useTranslation } from "next-i18next";
import styled from "@emotion/styled";
import { green, red, blue, deepPurple } from "@mui/material/colors";
import Link from "next/link";

import { Button, Container, Grid, Typography, Box } from "@mui/material";
import { spacing } from "@mui/system";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDesktop,
  faLaptop,
  faBrain,
  faDatabase,
  faCog,
  faFlask,
  faSquareFull,
} from "@fortawesome/free-solid-svg-icons";

const Wrapper = styled.div`
  padding-top: 3.5rem;
  padding-bottom: 1rem;
  position: relative;
  text-align: center;
  overflow: hidden;
`;

const Hero = styled(Typography)`
  line-height: 1.2;
  font-size: 2.75rem;
  font-weight: 700;
  text-align: center;

  ${(props) => props.theme.breakpoints.up("sm")} {
    font-size: 3.7rem;
  }

  background: linear-gradient(to right, #fc466b, #3f5efb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Title = styled(Typography)`
  line-height: 1.2;
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;

  ${(props) => props.theme.breakpoints.up("sm")} {
    font-size: 1.2rem;
  }

  background: linear-gradient(to right, #fc466b, #3f5efb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const SubTitle = styled.div`
  height: auto;
  padding-top: 15px;
  padding-bottom: 35px;
  font-size: 1.2em;
  font-weight: 500;
  text-align: center;
`;

const SubText = styled.div`
  height: auto;
  display: inline;
  padding-top: 10px;
  padding-bottom: 5px;
  font-size: 1.2em;
  margin-left: 10px;

  > a {
    color: white;
    padding-left: 10px;
  }
`;

const GradientButton = styled(Button)`
  border-radius: 50px;
  color: inherit;
  box-shadow: 0 0 6px 0 rgba(157, 96, 212, 0.5);
  border: solid 1px transparent;
  background-image: linear-gradient(
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0)
    ),
    linear-gradient(to right, #fc466b, #3f5efb);
  background-origin: border-box;
  background-clip: content-box, border-box;
  box-shadow: 2px 1000px 1px
    ${(props) => props.theme.palette.background.default} inset;

  &:hover {
    box-shadow: none;
    color: white;
    border: solid 1px transparent;
  }
`;

const FixedIcon = styled(FontAwesomeIcon)`
  position: absolute;
  font-size: ${(props) => (props.sizept ? props.sizept : 20)}pt;
  left: ${(props) => props.l}px;
  top: ${(props) => props.t}px;
  color: ${(props) => props.color};
`;

const GradientIcon = styled(FontAwesomeIcon)`
  position: absolute;
  font-size: ${(props) => (props.sizept ? props.sizept : 20)}pt;
  left: ${(props) => props.l}px;
  top: ${(props) => props.t}px;

  color: ${(props) => props.theme.palette.background.default};
  background: linear-gradient(to right, #fc466b, #3f5efb);
`;

function IntroGraph() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        position: "relative",
        margin: "auto",
      }}
    >
      <svg
        style={{
          minHeight: 250,
          minWidth: 350,
        }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="7"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
            fill="#b39ddb"
          >
            <polygon points="0 0, 6 3, 0 6" />
          </marker>
        </defs>
        <path
          d="M 40 160 C 40 60, 120 30, 130 30"
          stroke="#b39ddb"
          strokeWidth="2"
          fill="transparent"
          markerEnd="url(#arrowhead)"
        />
        <path
          d="M 240 30 C 300 30, 340 100, 340 150"
          stroke="#b39ddb"
          strokeWidth="2"
          fill="transparent"
          markerEnd="url(#arrowhead)"
        />
        <path
          d="M 300 180 C 250 180, 190 130, 190 80"
          stroke="#b39ddb"
          strokeWidth="2"
          fill="transparent"
          markerEnd="url(#arrowhead)"
        />
        <rect
          x="60"
          y="150"
          rx="16"
          ry="20"
          width="140"
          height="32"
          fill={blue[400]}
        />
        <text x="70" y="170" fill="white">
          {t("landing.animation.data")}
        </text>
        <rect fill={blue[400]} x="50" y="156" width="0" height="16">
          <animate
            attributeName="x"
            values="65 ; 192 ; 192 ; 192 ; 192 ; 192"
            dur="6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="width"
            values="128; 0; 0; 0; 0; 0"
            dur="6s"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="150"
          y="190"
          rx="16"
          ry="20"
          width="160"
          height="32"
          fill={blue[400]}
        />
        <text x="160" y="210" fill="white">
          {t("landing.animation.model")}
        </text>
        <rect fill={blue[400]} x="150" y="194" width="0" height="16">
          <animate
            attributeName="x"
            values="160 ; 160 ; 300 ; 300 ; 300 ; 300"
            dur="6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="width"
            values="140; 140; 0; 0 ; 0; 0"
            dur="6s"
            repeatCount="indefinite"
          />
        </rect>
        <text x="165" y="62" fill="#ab47bc" fontWeight="bold">
          {t("landing.openml")}
        </text>
      </svg>

      <FixedIcon
        color={deepPurple[200]}
        icon={faDesktop}
        l="0"
        t="170"
        sizept="45"
      />
      <FixedIcon
        color={deepPurple[200]}
        icon={faLaptop}
        l="300"
        t="170"
        sizept="45"
      />
      <GradientIcon
        mask={faSquareFull}
        icon={faBrain}
        l="167"
        t="0"
        sizept="36"
        suppressHydrationWarning={true}
      />
      <FixedIcon
        color={green[500]}
        icon={faDatabase}
        l="40"
        t="40"
        sizept="20"
      />
      <FixedIcon
        color={green[500]}
        icon={faDatabase}
        l="320"
        t="40"
        sizept="20"
      />
      <FixedIcon color={blue[500]} icon={faCog} l="200" t="80" sizept="20" />
      <FixedIcon color={red[500]} icon={faFlask} l="225" t="110" sizept="20" />
    </div>
  );
}

function Introduction() {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Container>
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={10}
        >
          <Grid item>
            <Hero>{t("landing.openml")}</Hero>
            <Title>{t("landing.title")}</Title>
            <SubTitle>{t("landing.subtitle")}</SubTitle>
          </Grid>
          <Grid item>
            <IntroGraph />
          </Grid>
          <Grid item>
            <GradientButton
              component={Link}
              href="/auth/sign-up"
              variant="outlined"
            >
              {t("landing.signup")}
            </GradientButton>
            <SubText>{t("landing.open")}</SubText>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default Introduction;
