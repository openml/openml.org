import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  Button,
  FormControl as MuiFormControl,
  Grid,
  Paper,
  Input,
  InputLabel,
  TextField,
  Typography
} from "@mui/material";

import { spacing } from "@mui/system";
import { Redirect } from "react-router-dom";

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)};
  margin-top:20px;
  margin-bottom:20px;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)};
  }
`;
const FormControl = styled(MuiFormControl)(spacing);

function Public() {
  const [error, setError] = useState(false);
  const [errormessage, setErrorMessage] = useState(false);
  const [success, setSuccess] = useState(false);

  const yourConfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  };

  function datatoflask(event) {
    event.preventDefault();

    axios
      .post(
        process.env.REACT_APP_SERVER_URL + "upload-collection-runs",
        {
          description: event.target.description.value,
          collectionname: event.target.collectionname.value,
          run_ids: event.target.runids.value,
          benchmark: event.target.benchmark.value
        },
        yourConfig
      )
      .then(function(response) {
        if (response.data.msg === "collection uploaded") {
          setSuccess(true);
        }
        console.log(response.data);
      })
      .catch(function(error) {
        setError(true);
        setErrorMessage("Could not upload collection");
        console.log(error.data);
      });

    return false;
  }

  return (
    <form onSubmit={datatoflask}>
      <Typography variant="h1" gutterBottom>
      Create Run Collection
      </Typography>      
      <Button color="primary" href="/auth/upload-collection-tasks">
        Want to create a task collection instead?
      </Button>
      {error && (
        <Typography component="h3" variant="body1" align="center" color="red">
          {errormessage}
        </Typography>
      )}
      <Grid container spacing={6}>
        <Grid item md={8}>
          <FormControl fullWidth mb={3}>
            <InputLabel htmlFor="collectionname">Collection name</InputLabel>
            <Input id="collectionname" />
          </FormControl>

          <FormControl fullWidth mb={3}>
            <TextField
              label="Description"
              id="description"
              rows={3}
              maxRows={4}
            />
          </FormControl>
          <FormControl fullWidth mb={3}>
            <TextField
              label="Related Task collection ID"
              id="benchmark"
              rows={3}
              maxRows={4}
            />
          </FormControl>
          <FormControl fullWidth mb={3}>
            <TextField label="RunIDs" id="runids" rows={3} maxRows={4} />
          </FormControl>
        </Grid>
      </Grid>

      <Button variant="contained" color="primary" type="Submit">
        Upload Collection
      </Button>

      {success && <Redirect to="/" />}
    </form>
  );
}

function Settings() {
  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item md={7} xs={10}>
        <Wrapper>
          <Public />
          {/*<Private />*/}
        </Wrapper>
      </Grid>
    </Grid >
  );
}

export default Settings;
