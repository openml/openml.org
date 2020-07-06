import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

import {
  Avatar,
  Button,
  Card as MuiCard,
  Divider as MuiDivider,
  Grid,
  Typography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const CenteredContent = styled.div`
  text-align: center;
`;

const BigAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin: 0 auto ${props => props.theme.spacing(2)}px;
`;

function Public() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(false);
  const [bio, setBio] = useState(false);
  const [fname, setFname] = useState(false);
  const [image, setImage] = useState(false);
  const [lname, setLname] = useState(false);

  const yourConfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  };
  axios
    .get(process.env.REACT_APP_SERVER_URL + "profile", yourConfig)
    .then(function(response) {
      console.log(response);
      setImage(response.data.image);
      setUser(response.data.username);
      setEmail(response.data.email);
      setBio(response.data.bio);
      setFname(response.data.first_name);
      setLname(response.data.last_name);
    })
    .catch(function(error) {
      console.log(error);
    });

  return (
    <Card mb={6}>
      <form>
        <Typography variant="h5" gutterBottom>
          Public info
        </Typography>
        <br />
        <Typography variant="h6" gutterBottom>
          User Name:{user}
          <br />
          Email: {email}
          <br />
          First Name: {fname}
          <br />
          Last Name: {lname}
          <br />
          Bio: {bio}
          <br />
        </Typography>
        <Typography variant="h6" gutterBottom></Typography>
        <Grid container spacing={6}>
          <Grid item md={8}></Grid>
          <Grid item md={4}>
            <CenteredContent>
              <BigAvatar alt="User Image" id="dp" src={image} />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
              />
            </CenteredContent>
          </Grid>
        </Grid>
        <Button variant="contained" color="primary" href="/auth/edit-profile">
          Edit Profile
        </Button>
        &nbsp;&nbsp;&nbsp;
        <Button variant="contained" color="primary" href="/auth/api-key">
          API Key
        </Button>
      </form>
    </Card>
  );
}

function Settings() {
  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom display="inline">
        Profile
      </Typography>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Public />
          {/*<Private />*/}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Settings;
