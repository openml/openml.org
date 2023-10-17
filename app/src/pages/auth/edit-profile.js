import React from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Helmet } from "react-helmet-async";

import DashboardLayout from "../../layouts/Dashboard";

import {
  Avatar,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  FormControl as MuiFormControl,
  Grid,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { CloudUpload as MuiCloudUpload } from "@mui/icons-material";
import { spacing } from "@mui/system";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);

const TextField = styled(MuiTextField)(spacing);

const Button = styled(MuiButton)(spacing);

const CloudUpload = styled(MuiCloudUpload)(spacing);

const CenteredContent = styled.div`
  text-align: center;
`;

const BigAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin: 0 auto ${(props) => props.theme.spacing(2)};
`;

const Link = styled(NextLink)`
  text-decoration: none;
  color: ${(props) => props.theme.palette.secondary.main};
`;

function Public() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Public info
        </Typography>

        <Grid container spacing={6}>
          <Grid item md={8}>
            <TextField
              id="username"
              label="Username"
              defaultValue="lucylavender"
              variant="outlined"
              fullWidth
              my={2}
            />

            <FormControl fullWidth my={2} variant="outlined">
              <TextField
                label="Biography"
                id="biography"
                multiline={true}
                rows={3}
                maxRows={4}
                variant="outlined"
                defaultValue="Lucy is a Freelance Writer and Social Media Manager who helps finance professionals and Fin-tech startups build an audience and get more paying clients online."
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <CenteredContent>
              <BigAvatar
                alt="Remy Sharp"
                src="/static/img/avatars/avatar-1.jpg"
              />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" color="primary" component="span">
                  <CloudUpload mr={2} /> Upload
                </Button>

                <Typography variant="caption" display="block" gutterBottom>
                  For best results, use an image at least 128px by 128px in .jpg
                  format
                </Typography>
              </label>
            </CenteredContent>
          </Grid>
        </Grid>

        <Button variant="contained" color="primary">
          Save changes
        </Button>
      </CardContent>
    </Card>
  );
}

function Private() {
  return (
    <Card mb={6}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Private info
        </Typography>

        <Grid container spacing={6}>
          <Grid item md={6}>
            <TextField
              id="first-name"
              label="First name"
              variant="outlined"
              defaultValue="Lucy"
              fullWidth
              my={2}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              id="last-name"
              label="Last name"
              variant="outlined"
              defaultValue="Lavender"
              fullWidth
              my={2}
            />
          </Grid>
        </Grid>

        <TextField
          id="email"
          label="Email"
          variant="outlined"
          type="email"
          defaultValue="lucylavender@gmail.com"
          fullWidth
          my={2}
        />

        <TextField
          id="address"
          label="Address"
          variant="outlined"
          fullWidth
          my={2}
        />

        <TextField
          id="address2"
          label="Apartment, studio, or floor"
          variant="outlined"
          fullWidth
          my={2}
        />

        <Grid container spacing={6}>
          <Grid item md={6}>
            <TextField
              id="city"
              label="City"
              variant="outlined"
              fullWidth
              my={2}
            />
          </Grid>
          <Grid item md={4}>
            <TextField
              id="state"
              label="State"
              variant="outlined"
              fullWidth
              my={2}
            />
          </Grid>
          <Grid item md={2}>
            <TextField
              id="zip"
              label="Zip"
              variant="outlined"
              fullWidth
              my={2}
            />
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" mt={3}>
          Save changes
        </Button>
      </CardContent>
    </Card>
  );
}

function EditProfile() {
  return (
    <React.Fragment>
      <Helmet title="Edit Profile" />

      <Typography variant="h3" gutterBottom display="inline">
        Edit Profile
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link href="/" passHref>
          Dashboard
        </Link>
        <Link href="/" passHref>
          Pages
        </Link>
        <Typography>Edit Profile</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Public />
          <Private />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

EditProfile.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default EditProfile;
