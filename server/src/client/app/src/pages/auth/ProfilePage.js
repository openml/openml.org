import React, { useState, useEffect, Component } from "react";
import styled from "styled-components";
import axios from "axios";

import {
  Avatar,
  Button,
  Dialog, 
  DialogContent, 
  DialogTitle,
  Card as MuiCard,
  CardContent,
  Grid,
  Typography,
  Paper,
  CardActionArea
} from "@mui/material";

import { spacing } from "@mui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { green, yellow, blue, red } from "@mui/material/colors";
import APIKey from "./APIKey"; 

const Card = styled(MuiCard)(spacing);

const BigAvatar = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin: 0 auto ${props => props.theme.spacing(2)}px;
`;
const BlueMenuIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: blue[800]
});
const MainPaper = styled(Paper)`
  flex: 1;
  background: ${props =>
    props.bg === "Gradient" ? "transparent" : props.theme.body.background};
  padding: 40px;
`;

const ELASTICSEARCH_SERVER = process.env.REACT_APP_URL_ELASTICSEARCH || "https://www.openml.org/es/";

function APIKeyModalButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        API Key
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <APIKey />
        </DialogContent>
      </Dialog>
    </>
  );
}

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

  const items = [
    { keyword: 'dataset', count: dataset, url: 'search?type=data&sort=date&uploader_id='+id, color: green[400] },
    { keyword: 'task', count: task, url: 'search?type=data&sort=task&uploader_id='+id, color: yellow[700] },
    { keyword: 'model', count: flow, url: 'search?type=data&sort=flow&uploader_id='+id, color: blue[800] },
    { keyword: 'run', count: run, url: 'search?type=data&sort=run&uploader_id='+id, color: red[400] },
  ];

  return (
    <React.Fragment>
    <Card mb={6}>
      <Grid container spacing={6}>
        <Grid item md={8}>
          <CardContent>
            <BigAvatar alt="User Image" id="dp" src={image} />
            <Typography variant="h1" gutterBottom>
              {fname || lname ? `${fname ?? ''} ${lname ?? ''}`.trim() : 'Anonymous'}
            </Typography>
            {bio ? bio : "No bio available."}
            <br />
            <br />
            <BlueMenuIcon icon="user-tag" fixedWidth /> ID: {id ? id : "unknown"}
          </CardContent>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item md={8}>
        <CardContent>
          <Button variant="contained" color="primary" href="/auth/edit-profile">
            Edit Profile
          </Button>
          &nbsp;&nbsp;&nbsp;
          <APIKeyModalButton />
          </CardContent>
        </Grid>
      </Grid>
      </Card>
      <Grid container spacing={6}>
      {items.map(({ keyword, count, url, color }, index) => (
        <Grid item sm={6} md={3} key={index}>
          <Card>
            <CardActionArea component="a" href={url}>
              <CardContent>
                <Typography variant="h6" gutterBottom color={color}>
                  {count} {keyword}{count !== 1 ? 's' : ''}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
      </Grid>
    </React.Fragment>
  );
}

class Settings extends Component {
  render() {
    return (
      <React.Fragment>
        <MainPaper>
          <Public />
        </MainPaper>
      </React.Fragment>
    );
  }
}

export default Settings;
