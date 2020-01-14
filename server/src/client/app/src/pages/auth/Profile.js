import React, {useState} from "react";
import styled from "styled-components";
import axios from "axios";

import {
  Avatar,
  Button,
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  FormControl as MuiFormControl,
  Grid,
  Input,
  InputLabel,
  TextField,
  Typography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {func} from "prop-types";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);

const FAIcon = styled(FontAwesomeIcon)(spacing);

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

  const yourConfig = {
   headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
   }
}
  axios.get("https://127.0.0.1:5000/profile",yourConfig)
      .then(function (response) {
        console.log(response);
        setUser(response.data.username);
        setEmail(response.data.email);
        setBio(response.data.bio);
        console.log('heyy')
        console.log(user);

      })
      .catch(function (error) {
        console.log(error);
      });
    function profiletoflask(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    axios
      .post("https://127.0.0.1:5000/profile", {
        bio: event.target.biography.value,
      }, yourConfig)
      .then(function(response) {
          console.log(response.data);
          })
      .catch(function(error) {
        console.log(error.data);
      });
    return false;
  }
  return (

    <Card mb={6}>
      <form onSubmit={profiletoflask}>
        <Typography variant="h6" gutterBottom>
          Public info
        </Typography>

        <Grid container spacing={6}>
          <Grid item md={8}>
              <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input id="username" defaultValue={user} />
            </FormControl>

            <FormControl fullWidth mb={3}>
              <TextField
                label="Biography"
                id="biography"
                multiline={true}
                rows={3}
                rowsMax={4}
                defaultValue={bio}
              />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <CenteredContent>
              <BigAvatar alt="Looking Good" src="/bot.png" />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                multiple
                type="file"
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" color="primary" component="span">
                  <FAIcon icon="cloud-upload-alt" mr={2} /> Upload
                </Button>

                <Typography variant="caption" display="block" gutterBottom>
                  For best results, use an image at least 128px by 128px in .jpg
                  format
                </Typography>
              </label>
            </CenteredContent>
          </Grid>
        </Grid>

        <Button variant="contained" color="primary" type="Submit">
          Save changes
        </Button>
    </form>

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
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="name">First name</InputLabel>
              <Input id="name" defaultValue="Ada" placeholder="First name" />
            </FormControl>
          </Grid>
          <Grid item md={6}>
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="name">Last name</InputLabel>
              <Input
                id="name"
                defaultValue="Lovelace"
                placeholder="Last name"
              />
            </FormControl>
          </Grid>
        </Grid>

        <FormControl fullWidth mb={3}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            type="email"
            defaultValue="adalovelace@gmail.com"
            placeholder="Email"
          />
        </FormControl>

        <FormControl fullWidth mb={3}>
          <InputLabel htmlFor="address">Address</InputLabel>
          <Input id="address" placeholder="1234 Main St" />
        </FormControl>

        <FormControl fullWidth mb={3}>
          <InputLabel htmlFor="address2">Address 2</InputLabel>
          <Input id="address2" placeholder="Apartment, studio, or floor" />
        </FormControl>

        <Grid container spacing={6}>
          <Grid item md={6}>
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="city">City</InputLabel>
              <Input id="city" placeholder="City" />
            </FormControl>
          </Grid>
          <Grid item md={4}>
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="state">State</InputLabel>
              <Input id="state" placeholder="State" />
            </FormControl>
          </Grid>
          <Grid item md={2}>
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="zip">Zip</InputLabel>
              <Input id="zip" placeholder="Zip" />
            </FormControl>
          </Grid>
        </Grid>

        <Button variant="contained" color="primary">
          Save changes
        </Button>
      </CardContent>
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
          <Private />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default Settings;
