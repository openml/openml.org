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
  faHandHoldingMedical,
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
  top: 85;
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
  return (
    <HeroTitle variant="h3" align="center" py={6}>
      <OpenMLDove color={red[500]} />
      <OpenMLDove color={yellow[800]} />
      <OpenMLDove color={green[500]} />
      <OpenMLDove color={blue[500]} />
      <HeroSubTitle style={{ paddingTop: 20 }}>
        Here's to the crazy ones.
        <br />
        The ones who want to set machine learning free.
        <br />
        They're not fond of hype, and have no respect for irreproducible claims.
        <br />
        They believe that openness will push the human race forward.
        <br />
        And by building and sharing the best data and models,
        <br />
        we will make the world better, together.
      </HeroSubTitle>
    </HeroTitle>
  );
};

const contribute_intro = {
  title: "Contributing",
  text: `The people who contribute to OpenML do so for the love of
         machine learning and because they want to help build a more
         inclusive and frictionless ecosystem of data, tools and clear
         results. You can contribute in different ways:`,
  items: [
    {
      icon: faHandHoldingHeart,
      link: "contribute#help",
      color: red[500],
      text: "Help us improve the OpenML platform and interfaces.",
    },
    {
      icon: faHandHoldingDollar,
      link: "contribute#sponsor",
      color: green[500],
      text: "Make a donation to support our community and keep OpenML free.",
    },
    {
      icon: faHandHoldingMedical,
      link: "contribute#help",
      color: blue[500],
      text: "Share new interesting datasets, models, and experiments.",
    },
  ],
};

const help_dev = {
  title: "Are you a developer?",
  icon: faUsersCog,
  iconColor: red[500],
  text: `We want to make OpenML ridiculously easy to use and empowering. 
             Contribute your skill and expertise to make OpenML better for yourself and others, either online (on GitHub) or during one of our coding sprints.`,
  chips: [
    {
      link: "contribute#help",
      icon: faBoltLightning,
      text: "Get started",
    },
  ],
};

const help_science = {
  title: "Are you a scientist?",
  icon: faUserAstronaut,
  iconColor: orange[700],
  text: `We want to empower people to change the world for the
             better. You can help by creating or sharing useful datasets and machine learning pipelines, or by extending OpenML to 
             make it more useful in science and discovery.`,
  chips: [
    {
      link: "contribute#help",
      icon: faBoltLightning,
      text: "Get started",
    },
  ],
};

const help_donate = {
  title: "Do you want to help?",
  icon: faSeedling,
  iconColor: green[800],
  text: `OpenML depends on all of us. You can help keep OpenML free
             and support our community by making a donation (no pressure). 
             You can also join us at an OpenML event, or organize one 
             yourself! Or maybe you have another great idea? Please don't hesitate to reach out!`,
  chips: [
    {
      link: "contribute#sponsor",
      icon: faBoltLightning,
      text: "Make a donation",
    },
    {
      link: "about",
      icon: faComments,
      text: "Get in touch",
    },
  ],
};

const help_exec = {
  title: "Are you an executive?",
  icon: faUserTie,
  iconColor: blue[400],
  text: `OpenML helps your team to discover machine learning assets
               and automate processes, so that they can focus on what
               matters. You can encourage your developers to help out, host a coding sprint, become an official sponsor, or partner with us. Legendary.`,
  chips: [
    {
      link: "contribute#sponsor",
      icon: faBoltLightning,
      text: "Make a donation",
    },
    {
      link: "about",
      icon: faComments,
      text: "Get in touch",
    },
  ],
};

const code = {
  title: "Do you know how to code?",
  icon: faCode,
  iconColor: blue[400],
  text: `Perfect! Please see the issue trackers of the different OpenML
         components that you can contribute to.`,
  chips: [
    {
      link: "https://docs.openml.org/Website/",
      icon: faBookOpen,
      text: "Developer docs",
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml.org/issues",
      icon: faAtom,
      text: "Website",
      target: "_blank",
    },
    {
      link: "https://github.com/openml/OpenML/issues",
      icon: faCloud,
      text: "REST API",
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-python/issues",
      icon: faPython,
      text: "Python API",
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-r/issues",
      icon: faRProject,
      text: "R API",
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml-java/issues",
      icon: faJava,
      text: "Java API",
      target: "_blank",
    },
  ],
};

const website = {
  title: "Good at web design / UX?",
  icon: faDrawPolygon,
  iconColor: purple[400],
  text: `Please help us improve the website to make it nicer and more
         intuitive for everyone.`,
  chips: [
    {
      link: "https://docs.openml.org/Website/",
      icon: faBookOpen,
      text: "Website docs",
      target: "_blank",
    },
    {
      link: "https://github.com/openml/openml.org/issues",
      icon: faAtom,
      text: "Website code and issues",
      target: "_blank",
    },
  ],
};

const docs = {
  title: "Are you good at explaining things?",
  icon: faBookReader,
  iconColor: red[800],
  text: `OpenML should be easy to understand for everyone. Please help us
         improve the documentation whenever something is not 100% clear.`,
  chips: [
    {
      link: "https://docs.openml.org",
      icon: faBookOpen,
      text: "OpenML docs",
      target: "_blank",
    },
    {
      link: "https://docs.openml.org/OpenML-Docs/",
      icon: faGithub,
      text: "How to update the docs",
      target: "_blank",
    },
  ],
};

const datasets = {
  title: "Do you care about good datasets?",
  icon: faDatabase,
  iconColor: green[400],
  text: `High quality datasets are crucial for machine learning. Please
         add new interesting datasets or help check the quality of the
         existing ones.`,
  chips: [
    {
      link: "https://github.com/openml/openml-data/issues",
      icon: faGithub,
      text: "Dataset issue tracker",
      target: "_blank",
    },
  ],
};

const ambassador = {
  title: "Help us build a stronger community",
  icon: faUsers,
  iconColor: red[200],
  text: `Become an OpenML ambassador! Help us make OpenML better known in
         your community, write about OpenML and how you use it, or give
         us shout-out.`,
  chips: [
    {
      link: "https://openml.github.io/blog",
      icon: faBlog,
      text: "OpenML blog",
      target: "_blank",
    },
    {
      link: "https://twitter.com/open_ml",
      icon: faTwitter,
      text: "OpenML on Twitter",
      target: "_blank",
    },
  ],
};

const donate = {
  title: "You are awesome!",
  text: `By making a donation, small or large, you help
          us run coding sprints and outreach activities, keep our   community happy and engaged, and ensure that we have the basic
          infrastructure to keep the platform free for everyone. Also, if
          OpenML sometimes sucks, we promise to do better! 
          You can sponsor us via OpenCollective or GitHub. All donors are celebrated in our hall of fame, and we are fully transparent on how your contributions are used.`,
  widgets: [
    {
      button: `https://opencollective.com/openml/donate/button@2x.png?color=blue`,
      link: "https://opencollective.com/openml",
      target: "_blank",
      alt: "OpenCollective",
    },
    {
      button: `/static/img/githubsponsor.png`,
      link: "https://github.com/sponsors/openml",
      target: "_blank",
      alt: "GitHub Sponsors",
    },
  ],
};

const sponsor_why = {
  title: "Why?",
  text: `Simply put, without our generous sponsors, OpenML would not be
  able to make all its resources and services available for free to the entire world. By donating to OpenML you
  further the project's mission to democratize machine learning
  research. Your donations will be used to run engaging community
  events (which require venues, catering and thank-you packages),
  to enable internships, and to maintain and improve our platform
  services, which requires compute and storage infrastructure, as
  well as technical development and maintenance. With your
  support, we can bring OpenML to the next level, together!`,
};

const sponsor_what = {
  title: "What do we offer?",
  text: `We are open to many forms of sponsorship. While we have a few sponsorship levels on our Open Collective page, we would also
  love to hear from you and learn how we could better align with
  your goals. Below are examples of possible benefits, but we are
  open to new ideas to collaborate with you.`,
  items: [
    {
      icon: faMedal,
      color: purple[700],
      text: "Your logo on our website and in our presentations, shown more prominently for larger sponsors.",
    },
    {
      icon: faTShirt,
      color: purple[700],
      text: "We will send you OpenML T-shirts, stickers,... Or, you can send us materials to hand out at our events.",
    },
    {
      icon: faComments,
      color: purple[700],
      text: "We will mention your support in talks and videos. We'll work with you to get the right message across.",
    },
    {
      icon: faGlassCheers,
      color: purple[700],
      text: "Come give a talk at one of our coding sprints or events, or simply come to work together with us.",
    },
    {
      icon: faLightbulb,
      color: purple[700],
      text: "Let us know what you would like to see developed on OpenML, and we'll realize it together.",
    },
    {
      icon: faHandsHelping,
      color: purple[700],
      text: "Become a partner. If you support a full time developer (anywhere), or let your own developers contribute, you can help shape the future of OpenML.",
    },
  ],
  chips: [
    {
      icon: faEnvelope,
      link: "mailto:openmlhq@googlegroups.com",
      color: purple[700],
      text: "Get in touch",
    },
  ],
};

const sponsor_how = {
  title: "How?",
  text: `You can sponsor us through Open Collective or GitHub. Click the buttons below to get started. All sponsors and the amount of sponsoring are acknowledged in our hall of fame, and we'll be fully transparent
  on how your sponsorship makes OpenML better every day. This
  collective is fiscally hosted by our not-for-profit Open Machine Learning Foundation. If preferred, you can also donate directly to the Foundation.`,
  widgets: [
    {
      button: `https://opencollective.com/openml/donate/button@2x.png?color=blue`,
      link: "https://opencollective.com/openml",
      target: "_blank",
      alt: "OpenCollective",
    },
    {
      button: `/static/img/githubsponsor.png`,
      link: "https://github.com/sponsors/openml",
      target: "_blank",
      alt: "GitHub Sponsors",
    },
  ],
};

function Contribute() {
  return (
    <Wrapper>
      <Helmet title="Join OpenML!" />
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
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Hero />
        </Grid>
        <Grid item xs={12}>
          <InfoCard info={contribute_intro} />
        </Grid>
        {[help_dev, help_science, help_donate, help_exec].map((card) => (
          <Grid item display="flex" xs={12} md={6} lg={3} key={card.title}>
            <InfoCard info={card} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Header
            id="help"
            title="Contribute to OpenML"
            icon={faHandHoldingHeart}
            color={red[400]}
          />
        </Grid>
        {[code, website, docs, datasets, ambassador].map((card) => (
          <Grid item display="flex" xs={12} md={6} lg={4} key={card.title}>
            <InfoCard info={card} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Header
            id="support"
            title="Make a donation"
            icon={faHandHoldingDollar}
            color={blue[500]}
          />
        </Grid>
        <Grid item xs={12}>
          <InfoCard info={donate} />
        </Grid>
        <Grid item xs={12}>
          <Header
            id="sponsor"
            title="Become an official Sponsor"
            icon={faHandsHelping}
            color={blue[500]}
          />
        </Grid>
        {[sponsor_why, sponsor_how, sponsor_what].map((card) => (
          <Grid item xs={12} key={card.title}>
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
