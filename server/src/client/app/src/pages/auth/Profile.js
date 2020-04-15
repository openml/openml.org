import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import ReactDOM from "react";
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
import { func } from "prop-types";
import {Redirect} from "react-router-dom";

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
  const [fname, setFname] = useState(false);
  const [lname, setLname] = useState(false);
  const [image, setImage] = useState(false);
  const [error, setError] = useState(false);
  const [imfile, setImg] = useState(false);
  const [errormessage, setErrorMessage] = useState(false);

  const yourConfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
   }
}
  axios.get(process.env.REACT_APP_SERVER_URL+"profile",yourConfig)
      .then(function (response) {
        console.log(response);

        setImg(response.data.image);
        if(image!==null){
        setImage(true);
        }
        setUser(response.data.username);
        setEmail(response.data.email);
        setBio(response.data.bio);
        setFname(response.data.first_name);
        setLname(response.data.last_name);
        console.log(user);
        console.log(imfile);
        console.log(image);

      })
      .catch(function (error) {
        console.log(error);
      });
  // axios.get(process.env.REACT_APP_SERVER_URL+"send-image",yourConfig)
  //     .then(function (response) {
  //         console.log(response.data)
  //       setImage(true);
  //         const data = new Blob([response.data]);
  //
  //       setImg(data);
  //       // const data =  new Buffer(response.data, 'binary').toString('base64')
  //       // const Example = ({ data }) => <img src={`data:image/jpeg;base64,${data}`} />
  //
  //
  //     })
  //     .catch(function(error) {
  //         console.log(error.data);
  //       });
    function profiletoflask(event) {
        event.preventDefault();
        console.log(event.target.image.files);

        if (/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/.test(event.target.email.value) !== true){
          setError(true);
          setErrorMessage("Plase enter valid email");
        }
        else{
          setError(false);
          axios
                .post(process.env.REACT_APP_SERVER_URL+"profile", {
                  bio: event.target.biography.value,
                  first_name: event.target.firstname.value,
                  last_name: event.target.lastname.value,
                  email:event.target.email.value,

                }, yourConfig)
                .then(function(response) {
                  console.log(response.data);
                })
                .catch(function(error) {
                  console.log(error.data);
                });
          let images = event.target.image.files
          let formData = new FormData();

          formData.append('file', images[0])
            console.log(formData);
          setImage(images[0])
                    axios.post(process.env.REACT_APP_SERVER_URL+"image",formData,yourConfig)
            .then(response => console.log(response))
            .catch(errors => console.log(errors));

          }
        return false;
  }
  return (
    <Card mb={6}>
      <form onSubmit={profiletoflask}>
        <Typography variant="h6" gutterBottom>
          Public info
        </Typography>
        {
        error &&
        (
        <Typography component="h3" variant="body1" align="center" color="red">
          {errormessage}
        </Typography>
      )
      }
        {/*TODO : find why the update only works with multiline*/}
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
            <FormControl fullWidth mb={3}>
              <TextField
                label="First Name"
                id="firstname"
                multiline={true}
                rows={3}
                rowsMax={4}
                defaultValue={fname}
              />
              {/*<InputLabel htmlFor="firstname">First name</InputLabel>*/}
              {/*<Input id="firstname" defaultValue={fname} placeholder="First name" />*/}
            </FormControl>
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="lastname">Last name</InputLabel>
              <Input
                id="lastname"
                defaultValue={lname}
                placeholder="Last name"
                multiline={true}
              />
            </FormControl>
           <FormControl fullWidth mb={3}>
          <InputLabel htmlFor="email">Email</InputLabel>
          <Input
            id="email"
            type="email"
            defaultValue={email}
            placeholder="Email"
            multiline={true}
          />
        </FormControl>
          </Grid>
          <Grid item md={4}>
            <CenteredContent>
              {/*<BigAvatar alt="Looking Good"  src={process.env.REACT_APP_SERVER_URL + {imfile}}/>*/}
          {image && imfile && (
          <BigAvatar alt="Looking Good"  id="dp" src={process.env.REACT_APP_SERVER_URL + imfile}/>
        )
        }
                {process.env.REACT_APP_SERVER_URL + imfile}
        {/*<img src={process.env.REACT_APP_SERVER_URL + {imfile}}/>*/}
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="image"
                multiple
                type="file"

              />
              <label htmlFor="image">
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
