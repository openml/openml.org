import React from "react";
import { styled } from "@mui/material/styles";
import { withTheme } from "@emotion/react";
import NextLink from "next/link";
import { Helmet } from "react-helmet-async";
import { Bar } from "react-chartjs-2";

import DashboardLayout from "../../layouts/Dashboard";

import {
  Avatar as MuiAvatar,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  Chip as MuiChip,
  Divider as MuiDivider,
  Grid as MuiGrid,
  LinearProgress as MuiLinearProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography as MuiTypography,
} from "@mui/material";
import { spacing } from "@mui/system";

import {
  faBriefcase,
  faDollarSign,
  faExternalLink,
  faHome,
  faMapPin,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faXTwitter,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

// Server-side translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export async function getStaticProps({ locale }) {
  return {
    props: {
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Button = styled(MuiButton)(spacing);

const Card = styled(MuiCard)(spacing);

const Chip = styled(MuiChip)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Grid = styled(MuiGrid)(spacing);

const LinearProgress = styled(MuiLinearProgress)(spacing);

const Spacer = styled("div")(spacing);

const Typography = styled(MuiTypography)(spacing);

const Avatar = styled(MuiAvatar)`
  display: inline-block;
  height: 128px;
  width: 128px;
`;

const Centered = styled("div")({
  textAlign: "center",
});

const AboutIcon = styled("span")(({ theme }) => ({
  display: "flex",
  paddingRight: theme.spacing(2),
  svg: {
    width: "14px",
    height: "14px",
  },
}));

const ChartWrapper = styled("div")({
  height: "280px",
  position: "relative",
});

const StatsIcon = styled("div")(({ theme }) => ({
  position: "absolute",
  right: "16px",
  top: "32px",
  svg: {
    width: "32px",
    height: "32px",
    color: theme.palette.secondary.main,
  },
}));

const Link = styled(NextLink)`
  text-decoration: none;
  color: ${(props) => props.theme.palette.secondary.main};
`;

const ProductsChip = styled(Chip)`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
`;

const TableWrapper = styled("div")(({ theme }) => ({
  overflowY: "auto",
  maxWidth: `calc(100vw - ${theme.spacing(12)})`,
}));

function Details() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Profile Details
        </Typography>

        <Spacer mb={4} />

        <Centered>
          <Avatar alt="Lucy Lavender" src="/static/img/avatars/avatar-1.jpg" />
          <Typography variant="body2" component="div" gutterBottom>
            <Box fontWeight="fontWeightMedium">Lucy Lavender</Box>
            <Box fontWeight="fontWeightRegular">Lead Developer</Box>
          </Typography>

          <Button mr={2} variant="contained" color="primary" size="small">
            Follow
          </Button>
          <Button mr={2} variant="contained" color="primary" size="small">
            Message
          </Button>
        </Centered>
      </CardContent>
    </Card>
  );
}

function Skills() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Skills
        </Typography>

        <Spacer mb={4} />

        <Centered>
          <Chip size="small" mr={1} mb={1} label="HTML" color="secondary" />
          <Chip size="small" mr={1} mb={1} label="JavaScript" />
          <Chip size="small" mr={1} mb={1} label="Sass" />
          <Chip size="small" mr={1} mb={1} label="React" />
          <Chip size="small" mr={1} mb={1} label="Redux" />
          <Chip size="small" mr={1} mb={1} label="Next.js" />
          <Chip size="small" mr={1} mb={1} label="Material UI" />
          <Chip size="small" mr={1} mb={1} label="UI" />
          <Chip size="small" mr={1} mb={1} label="UX" />
        </Centered>
      </CardContent>
    </Card>
  );
}

function About() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          About
        </Typography>

        <Spacer mb={4} />

        <Grid container direction="row" alignItems="center" mb={2}>
          <Grid item>
            <AboutIcon>
              <FontAwesomeIcon icon={faHome} />
            </AboutIcon>
          </Grid>
          <Grid item>
            Lives in{" "}
            <Link href="https://mira.bootlab.io/">San Fransisco, SA</Link>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" mb={2}>
          <Grid item>
            <AboutIcon>
              <FontAwesomeIcon icon={faBriefcase} />
            </AboutIcon>
          </Grid>
          <Grid item>
            Works at <Link href="https://mira.bootlab.io/">Material UI</Link>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <AboutIcon>
              <FontAwesomeIcon icon={faMapPin} />
            </AboutIcon>
          </Grid>
          <Grid item>
            Lives in <Link href="https://mira.bootlab.io/">Boston</Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function Elsewhere() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Elsewhere
        </Typography>

        <Spacer mb={4} />

        <Grid container direction="row" alignItems="center" mb={2}>
          <Grid item>
            <AboutIcon>
              <FontAwesomeIcon icon={faExternalLink} />
            </AboutIcon>
          </Grid>
          <Grid item>
            <Link href="https://mira.bootlab.io/">lucylavender.io</Link>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" mb={2}>
          <Grid item>
            <AboutIcon>
              <FontAwesomeIcon icon={faTwitter} />
            </AboutIcon>
          </Grid>
          <Grid item>
            <Link href="https://mira.bootlab.io/">Twitter</Link>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center" mb={2}>
          <Grid item>
            <AboutIcon>
              <FontAwesomeIcon icon={faFacebook} />
            </AboutIcon>
          </Grid>
          <Grid item>
            <Link href="https://mira.bootlab.io/">Facebook</Link>
          </Grid>
        </Grid>
        <Grid container direction="row" alignItems="center">
          <Grid item>
            <AboutIcon>
              <FontAwesomeIcon icon={faInstagram} />
            </AboutIcon>
          </Grid>
          <Grid item>
            <Link href="https://mira.bootlab.io/">Instagram</Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function Earnings() {
  return (
    <Box position="relative">
      <Card mb={6} pt={2}>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            <Box fontWeight="fontWeightRegular">$ 2.405</Box>
          </Typography>
          <Typography variant="body2" gutterBottom mt={3} mb={0}>
            Total Earnings
          </Typography>

          <StatsIcon>
            <FontAwesomeIcon icon={faDollarSign} />
          </StatsIcon>
          <LinearProgress
            variant="determinate"
            value={75}
            color="secondary"
            mt={4}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

function Orders() {
  return (
    <Box position="relative">
      <Card mb={6} pt={2}>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            <Box fontWeight="fontWeightRegular">30</Box>
          </Typography>
          <Typography variant="body2" gutterBottom mt={3} mb={0}>
            Orders Today
          </Typography>

          <StatsIcon>
            <FontAwesomeIcon icon={faShoppingBag} />
          </StatsIcon>
          <LinearProgress
            variant="determinate"
            value={30}
            color="secondary"
            mt={4}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

function Revenue() {
  return (
    <Box position="relative">
      <Card mb={6} pt={2}>
        <CardContent>
          <Typography variant="h2" gutterBottom>
            <Box fontWeight="fontWeightRegular">$ 1.224</Box>
          </Typography>
          <Typography variant="body2" gutterBottom mt={3} mb={0}>
            Total Revenue
          </Typography>

          <StatsIcon>
            <FontAwesomeIcon icon={faDollarSign} />
          </StatsIcon>
          <LinearProgress
            variant="determinate"
            value={50}
            color="secondary"
            mt={4}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

function Products() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Products
        </Typography>
        <TableWrapper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Tech</TableCell>
                <TableCell>License</TableCell>
                <TableCell>Sales</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  AppStack
                </TableCell>
                <TableCell>
                  <ProductsChip size="small" label="HTML" color="primary" />
                </TableCell>
                <TableCell>Single License</TableCell>
                <TableCell>76</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Mira
                </TableCell>
                <TableCell>
                  <ProductsChip size="small" label="React" color="success" />
                </TableCell>
                <TableCell>Single License</TableCell>
                <TableCell>38</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Milo
                </TableCell>
                <TableCell>
                  <ProductsChip size="small" label="HTML" color="primary" />
                </TableCell>
                <TableCell>Single License</TableCell>
                <TableCell>43</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Robust UI Kit
                </TableCell>
                <TableCell>
                  <ProductsChip size="small" label="Angular" color="error" />
                </TableCell>
                <TableCell>Single License</TableCell>
                <TableCell>27</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Spark
                </TableCell>
                <TableCell>
                  <ProductsChip size="small" label="React" color="success" />
                </TableCell>
                <TableCell>Single License</TableCell>
                <TableCell>12</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableWrapper>
      </CardContent>
    </Card>
  );
}

const SalesRevenue = withTheme(({ theme }) => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Sales",
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.main,
        hoverBackgroundColor: theme.palette.secondary.main,
        hoverBorderColor: theme.palette.secondary.main,
        data: [54, 67, 41, 55, 62, 45, 55, 73, 60, 76, 48, 79],
        barPercentage: 0.625,
        categoryPercentage: 0.5,
      },
      {
        label: "Revenue",
        backgroundColor: theme.palette.grey[200],
        borderColor: theme.palette.grey[200],
        hoverBackgroundColor: theme.palette.grey[200],
        hoverBorderColor: theme.palette.grey[200],
        data: [69, 66, 24, 48, 52, 51, 44, 53, 62, 79, 51, 68],
        barPercentage: 0.625,
        categoryPercentage: 0.5,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        stacked: false,
      },

      x: {
        stacked: false,
        grid: {
          color: "transparent",
        },
      },
    },
  };

  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sales / Revenue
        </Typography>

        <Spacer mb={6} />

        <ChartWrapper>
          <Bar data={data} options={options} />
        </ChartWrapper>
      </CardContent>
    </Card>
  );
});

function Profile() {
  return (
    <React.Fragment>
      <Helmet title="Profile" />

      <Typography variant="h3" gutterBottom display="inline">
        Profile
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link href="/" passHref>
          Dashboard
        </Link>
        <Link href="/" passHref>
          Pages
        </Link>
        <Typography>Profile</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} lg={4} xl={3}>
          <Details />
          <Skills />
          <About />
          <Elsewhere />
        </Grid>
        <Grid item xs={12} lg={8} xl={9}>
          <SalesRevenue />
          <Grid container spacing={6}>
            <Grid item xs={12} lg={4}>
              <Earnings />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Orders />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Revenue />
            </Grid>
          </Grid>
          <Products />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Profile.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Profile;
