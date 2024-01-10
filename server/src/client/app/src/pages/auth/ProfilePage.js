import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

import {
  Avatar,
  Button,
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  Grid,
  Typography
} from "@mui/material";

import { spacing } from "@mui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { green, yellow, blue, red } from "@mui/material/colors";

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
const GreenMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: green[400]
});
const YellowMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: yellow[700]
});
const BlueMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: blue[800]
});
const RedMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: red[400]
});

const ELASTICSEARCH_SERVER = process.env.REACT_APP_URL_ELASTICSEARCH || "https://www.openml.org/es/";

function Public() {
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [fname, setFname] = useState("");
  const [image, setImage] = useState(false);
  const [lname, setLname] = useState("");
  const [flow, setFlow] = useState(0);
  const [dataset, setDataset] = useState(0);
  const [run, setRun] = useState(0);
  const [task, setTask] = useState(0);
  const [id, setId] = useState(false);

  useEffect(() => {
    const yourConfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    };

    axios
      .get(process.env.REACT_APP_URL_SITE_BACKEND + "profile", yourConfig)
      .then(function(response) {
        console.log(response);
        setImage(response.data.image);
        setEmail(response.data.email);
        setBio(response.data.bio);
        setFname(response.data.first_name);
        setLname(response.data.last_name);
        setId(response.data.id);
        if (id !== false) {
          fetch(`${ELASTICSEARCH_SERVER}user/user/` + id.toString())
            .then(response => response.json())
            .then(data => {
              setDataset(data._source.datasets_uploaded);
              setRun(data._source.runs_uploaded);
              setTask(data._source.tasks_uploaded);
              setFlow(data._source.flows_uploaded);
            });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  }, [id]);

  return (
    <Card mb={6}>
      <Grid container spacing={6}>
        <Grid item md={8}>
          <CardContent>
            <Typography variant="h1" gutterBottom>
              {fname} {lname}
            </Typography>
            <br />

            <Typography gutterBottom>
              <br />
              User ID: {id}
              <br />
              Email: {email}
              <br />
              Bio: {bio}
            </Typography>
          </CardContent>
        </Grid>
        <Grid item md={8}>
          <CardContent>
            <br />
            <GreenMenuIcon icon="database" fixedWidth />
            Datasets uploaded: {dataset}
            <br />
            <YellowMenuIcon icon={["fas", "flag"]} fixedWidth />
            Tasks uploaded: {task}
            <br />
            <BlueMenuIcon icon="cog" fixedWidth />
            Flows uploaded: {flow}
            <br />
            <RedMenuIcon icon="flask" fixedWidth />
            Runs uploaded: {run}
          </CardContent>
        </Grid>
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
