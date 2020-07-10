import React, { useEffect } from "react";

import styled from "styled-components";
import { green, orange, red, grey } from "@material-ui/core/colors";

import {
  Card as MuiCard,
  CardContent,
  Grid,
  Paper,
  CardHeader,
  Avatar,
  IconButton,
  CardActions,
  Collapse,
  Chip,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography as MuiTypography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HashLink } from "react-router-hash-link";

const scrollOffset = el => {
  el.scrollIntoView(true);
  window.scrollBy(0, -64);
};
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
const GreenIcon = styled(FontAwesomeIcon)({
  color: green[400],
  marginLeft: 10,
  marginRight: 10,
  fontWeight: 800
});

const OrangeIcon = styled(FontAwesomeIcon)({
  color: orange[400],
  marginLeft: 10,
  marginRight: 10,
  fontWeight: 800
});

const RedIcon = styled(FontAwesomeIcon)({
  color: red[400],
  marginLeft: 10,
  marginRight: 10,
  fontWeight: 800
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
      size="small"
      color="primary"
      variant="outlined"
      style={{ marginLeft: 10, marginBottom: 10 }}
    />
  );
};

const Reference = ({
  header,
  author,
  title,
  journal,
  volume,
  number,
  year,
  pages,
  url,
  doi,
  publisher,
  arxiv
}) => {
  const [expanded, setExpanded] = React.useState(false);

  const bibtex = `
    @article{OpenML${year}
      author = {${author}},
      title = {${title}},
      journal = {${journal}},
      volume = {${volume}},
      number = {${number}},
      year = {${year}},
      pages = {${pages}},
      url = {${url}},
      doi = {${doi}},
      publisher = {${publisher}}
    }`;

  const handleExpandClick = () => {
    setExpanded(!expanded);
    navigator.clipboard.writeText(bibtex);
  };

  return (
    <Grid item style={{ display: "flex" }} xs={12} sm={6}>
      <Card>
        <CardHeader
          avatar={
            <Avatar style={{ backgroundColor: green[500] }}>
              <FontAwesomeIcon icon="book-open" />
            </Avatar>
          }
          title={header}
        />
        <CardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Typography style={{ fontSize: 13 }}>
            {author}.{" "}
            <b>
              <i>{title}.</i>
            </b>
            {journal} {volume}
            {number && `(${number}), `}
            {pages && `pp ${pages}, `}
            {year}
          </Typography>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton>
            <Link href={arxiv} target="_blank">
              <FontAwesomeIcon icon="file-pdf" fixedWidth />
            </Link>
          </IconButton>
          <IconButton
            onClick={handleExpandClick}
            aria-expanded={expanded}
            style={{ marginLeft: "auto" }}
          >
            <FontAwesomeIcon icon="graduation-cap" fixedWidth />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Typography style={{ paddingLeft: 15, paddingBottom: 15 }}>
            BibTex copied to clipboard!
          </Typography>
        </Collapse>
      </Card>
    </Grid>
  );
};

function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

function Terms() {
  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element)
        element.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }, []);

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
          <TopLink smooth to="/terms#licences" scroll={el => scrollOffset(el)}>
            Licenses
          </TopLink>
          <TopLink smooth to="/terms#citation" scroll={el => scrollOffset(el)}>
            Citation
          </TopLink>
          <TopLink smooth to="/terms#terms" scroll={el => scrollOffset(el)}>
            Terms
          </TopLink>
          <TopLink smooth to="/terms#privacy" scroll={el => scrollOffset(el)}>
            Privacy
          </TopLink>
        </List>
        <Grid>
          <HeroTitle variant="h3" align="center" id="licences">
            Open Machine Learning, Open licenses
          </HeroTitle>
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="body1" gutterBottom my={4}>
                  We believe that machine learning should be as open and
                  accessible as possible. The{" "}
                  <a href="about">OpenML team and contributers</a> have invested
                  countless hours of time and resources to make this dream come
                  true, so please give credit where credit is due.
                </Typography>
                <List component="nav" aria-label="main mailbox folders">
                  <ListItemLink
                    button
                    href="http://creativecommons.org/licenses/by/4.0/"
                  >
                    <ListItemIcon>
                      <GreenIcon
                        icon={["fab", "creative-commons-by"]}
                        size="lg"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      You are free to use OpenML and all empirical data and
                      metadata under the <b>CC-BY</b> licence. Use the citations
                      below.
                    </ListItemText>
                  </ListItemLink>
                  <ListItemLink
                    button
                    href="https://opensource.org/licenses/BSD-3-Clause"
                  >
                    <ListItemIcon>
                      <GreenIcon icon={["fab", "osi"]} size="lg" />
                    </ListItemIcon>
                    <ListItemText>
                      The code of the OpenML platform and libraries is{" "}
                      <b>BSD</b> (3-Clause) licensed.
                    </ListItemText>
                  </ListItemLink>
                  <ListItemLink button href="">
                    <ListItemIcon>
                      <OrangeIcon
                        icon={["fab", "creative-commons"]}
                        size="lg"
                      />
                    </ListItemIcon>
                    <ListItemText>
                      Individual datasets and algorithms may come with their own
                      citation requests. Please honor such requests. OpenML will
                      show them when they are known.
                    </ListItemText>
                  </ListItemLink>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={6} style={{ padding: 15 }}>
          <Grid item xs={12}>
            <HeroTitle variant="h3" align="center" id="citation">
              <RedIcon icon="heart" /> Citing OpenML
              <HeroSubTitle>
                If you have used OpenML in a scientific publication, we would
                appreciate citations to all relevant papers below.
              </HeroSubTitle>
            </HeroTitle>
          </Grid>
        </Grid>
        <Grid item container spacing={4} xs={12}>
          <Reference
            header="OpenML as a whole"
            author="Joaquin Vanschoren, Jan N. van Rijn, Bernd Bischl, Luis Torgo"
            title="OpenML: networked science in machine learning"
            journal="SIGKDD Explorations"
            volume="15"
            number="2"
            year="2013"
            pages="49-60"
            url="http://doi.acm.org/10.1145/2641190.264119"
            doi="10.1145/2641190.2641198"
            publisher="ACM"
            arxiv={"https://arxiv.org/pdf/1407.7722.pdf"}
          />
          <Reference
            header="OpenML Python package"
            author="Matthias Feurer, Jan N. van Rijn, Arlind Kadra, Pieter Gijsbers, Neeratyoy Mallik, Sahithya Ravi, Andreas Mueller, Joaquin Vanschoren, Frank Hutter"
            title="OpenML-Python: an extensible Python API for OpenML"
            journal="arXiv"
            volume="1911.02490"
            number=""
            year="2020"
            pages=""
            url="https://arxiv.org/pdf/1911.02490.pdf"
            doi=""
            publisher=""
            arxiv={"https://arxiv.org/pdf/1911.02490.pdf"}
          />
          <Reference
            header="OpenML R package"
            author="Giuseppe Casalicchio, Jakob Bossek, Michel Lang, Dominik Kirchhoff, Pascal Kerschke, Benjamin Hofner, Heidi Seibold, Joaquin Vanschoren, Bernd Bischl"
            title="OpenML: An R package to connect to the machine learning platform OpenML"
            journal="Computational Statistics"
            volume="32"
            number="3"
            year="2017"
            pages="1-15"
            url="http://doi.acm.org/10.1007/s00180-017-0742-2"
            doi="10.1007/s00180-017-0742-2"
            publisher="Springer Nature"
            arxiv={"https://arxiv.org/abs/1701.01293"}
          />
        </Grid>
        <Grid container spacing={6} style={{ paddingTop: 20 }}>
          <Grid item xs={12}>
            <HeroTitle variant="h3" align="center" id="terms">
              Honor Code and Terms of Use
            </HeroTitle>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Honor Code
                </Typography>
                <Typography variant="body1" gutterBottom my={6}>
                  By joining OpenML, you join a special worldwide community of
                  data scientists building on each other's results and
                  connecting their minds as efficiently as possible. This
                  community depends on your motivation to share data, tools and
                  ideas, and to do so with honesty. In return, you will gain
                  trust, visibility and reputation, igniting online
                  collaborations and studies that otherwise may not have
                  happened.
                </Typography>
                <Typography variant="body1" gutterBottom my={4}>
                  By using any part of OpenML, you agree to:
                </Typography>
                <ul>
                  <li>
                    <b>Give credit where credit is due.</b> Cite the authors
                    whose work you are building on, or build collaborations
                    where appropriate.
                  </li>
                  <li>
                    <b>Give back to the community</b> by sharing your own data
                    as openly and as soon as possible, or by helping the
                    community in other ways. In doing so, you gain visibility
                    and impact (citations).
                  </li>
                  <li>
                    <b>Share data according to your best efforts.</b> Everybody
                    make mistakes, but we trust you to correct them as soon as
                    possible. Remove or flag data that cannot be trusted.
                  </li>
                  <li>
                    <b>Be polite and constructive</b> in all discussions.
                    Criticism of methods is welcomed, but personal criticisms
                    should be avoided.
                  </li>
                  <li>
                    <b>Do not steal</b> the work of people who openly share it.
                    OpenML makes it easy to find all shared data (and when it
                    was shared), thus everybody will know if you do this.
                  </li>
                </ul>

                <Typography variant="h6" style={{ paddingTop: 20 }}>
                  Terms of Use
                </Typography>
                <ul>
                  <li>
                    You agree that you are responsible for your own use of
                    OpenML.org and all content submitted by you, in accordance
                    with the Honor Code and all applicable local, state,
                    national and international laws.
                  </li>
                  <li>
                    By submitting or distributing content from OpenML.org, you
                    affirm that you have the necessary rights, licenses,
                    consents and/or permissions to reproduce and publish this
                    content. You cannot upload sensitive or confidential data.
                    You, and not the developers of OpenML.org, are solely
                    responsible for your submissions.
                  </li>
                  <li>
                    By submitting content to OpenML.org, you grant OpenML.org
                    the right to host, transfer, display and use this content,
                    in accordance with your sharing settings and any licences
                    granted by you. You also grant to each user a non-exclusive
                    license to access and use this content for their own
                    research purposes, in accordance with any licences granted
                    by you.
                  </li>
                  <li>
                    You may maintain one user account and not let anyone else
                    use your username and/or password. You may not impersonate
                    other persons.
                  </li>
                  <li>
                    You will not intend to damage, disable, or impair any OpenML
                    server or interfere with any other party's use and enjoyment
                    of the service. You may not attempt to gain unauthorized
                    access to the Site, other accounts, computer systems or
                    networks connected to any OpenML server. You may not obtain
                    or attempt to obtain any materials or information not
                    intentionally made available through OpenML.
                  </li>
                  <li>
                    Strictly prohibited are content that defames, harasses or
                    threatens others, that infringes another's intellectual
                    property, as well as indecent or unlawful content,
                    advertising, or intentionally inaccurate information posted
                    with the intent of misleading others. It is also prohibited
                    to post code containing viruses, malware, spyware or any
                    other similar software that may damage the operation of
                    another's computer or property.
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <HeroTitle variant="h3" align="center" id="privacy">
              Privacy Policy
            </HeroTitle>
            <Card>
              <CardContent>
                <Typography variant="body1" gutterBottom my={6}>
                  At OpenML, accessible from openml.org, one of our main
                  priorities is the privacy of our visitors. This Privacy Policy
                  contains types of information that is collected and recorded
                  by the OpenML website and how we use it. It applies only to
                  our online activities and is valid for visitors to our website
                  with regards to the information that they shared and/or
                  collect in OpenML. If you have additional questions or require
                  more information about our Privacy Policy, do not hesitate to
                  contact us.
                </Typography>
                <Typography variant="h6" gutterBottom>
                  General Data Protection Regulation (GDPR)
                </Typography>
                <Typography variant="body1" gutterBottom my={4}>
                  We are a Data Controller of your information. OpenML's legal
                  basis for collecting and using the personal information
                  described in this Privacy Policy depends on the Personal
                  Information we collect and the specific context in which we
                  collect the information:
                </Typography>
                <ul>
                  <li>OpenML needs to perform a contract with you</li>
                  <li>You have given OpenML permission to do so</li>
                  <li>
                    Processing your personal information is in OpenML legitimate
                    interests
                  </li>
                  <li>OpenML needs to comply with the law </li>
                </ul>

                <Typography variant="body1" gutterBottom my={4}>
                  OpenML will retain your personal information only for as long
                  as is necessary for the purposes set out in this Privacy
                  Policy. We will retain and use your information to the extent
                  necessary to comply with our legal obligations, resolve
                  disputes, and enforce our policies.
                </Typography>

                <Typography variant="body1" gutterBottom my={4}>
                  If you are a resident of the European Economic Area (EEA), you
                  have certain data protection rights. If you wish to be
                  informed what Personal Information we hold about you and if
                  you want it to be removed from our systems, please contact us.
                  In certain circumstances, you have the following data
                  protection rights:
                </Typography>
                <ul>
                  <li>
                    The right to access, update or to delete the information we
                    have on you.
                  </li>
                  <li>The right of rectification.</li>
                  <li>The right to object.</li>
                  <li>The right of restriction.</li>
                  <li>The right to data portability.</li>
                  <li>The right to withdraw consent.</li>
                </ul>
                <Typography variant="h6" style={{ paddingTop: 15 }}>
                  Log Files
                </Typography>
                <Typography variant="body1" gutterBottom my={6}>
                  OpenML follows a standard procedure of using log files, with
                  the sole purpose of improving the user experience. These files
                  log visitors when they visit websites. All hosting services do
                  this as a part of hosting services' analytics. The information
                  collected by log files include internet protocol (IP)
                  addresses, browser type, Internet Service Provider (ISP), date
                  and time stamp, referring/exit pages, and possibly the number
                  of clicks. These are not linked to any information that is
                  personally identifiable. The purpose of the information is for
                  analyzing trends, administering the site, tracking users'
                  usage of the website, and gathering demographic information.
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Cookies
                </Typography>
                <Typography variant="body1" gutterBottom my={4}>
                  Like any other website, OpenML uses 'cookies'. These cookies
                  are used to store information including visitors' preferences,
                  and the pages on the website that the visitor accessed or
                  visited. The information is used to optimize the users'
                  experience by customizing our web page content based on
                  visitors' browser type and/or other information. You can
                  choose to disable cookies through your individual browser
                  options (see your browsers' respective websites).
                </Typography>
                <Typography variant="body1" gutterBottom my={6}>
                  OpenML does not share this information with any third party,
                  and does not run any advertising services.
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Children's information
                </Typography>
                <Typography variant="body1" gutterBottom my={6}>
                  OpenML does not knowingly collect any Personal Identifiable
                  Information from children under the age of 13. If you think
                  that your child provided this kind of information on our
                  website, we strongly encourage you to contact us immediately
                  and we will do our best efforts to promptly remove such
                  information from our records.
                </Typography>
                <Typography variant="h6" gutterBottom>
                  Consent
                </Typography>
                <Typography variant="body1" gutterBottom my={4}>
                  By using our website, you hereby consent to our Privacy Policy
                  and agree to its terms.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Typography style={{ paddingTop: 20 }}>
          Further questions? Feel free to
          <ContactChip
            link="/about#contact"
            icon={"phone"}
            color={green[400]}
            text="contact us"
          />
        </Typography>
      </MainPaper>
    </React.Fragment>
  );
}

export default Terms;
