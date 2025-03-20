import React, { useState, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  Button,
  Box,
  Paper,
  Chip,
  Card,
  FormControl as MuiFormControl,
  Grid,
  Input,
  InputLabel,
  TextField,
  Typography
} from "@mui/material";

import { spacing } from "@mui/system";
import { Redirect } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { green } from "@mui/material/colors";
import { useDropzone } from 'react-dropzone'

const DropCard = styled(Card)`
  padding: ${props => props.theme.spacing(3)};
  margin-top:20px;
  margin-bottom:20px;
  background-color: ${green[50]};
`;

const Paragraph = styled(Typography)({
  paddingBottom: "1vw"
});

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
  const [editdata, setEditData] = useState(false);
  const [uploaddata, setUploadData] = useState(false);
  const [editpath, setEditPath] = useState(false);
  const [editsuccess, setEditSuccess] = useState(false);
  const [licence, setLicence] = useState(false);

  const onDrop = useCallback(acceptedFiles => {
    console.log(acceptedFiles);
  }, []);
  
  const maxSize = 1000000000;
  const { getRootProps, getInputProps, acceptedFiles } = useDropzone({
    onDrop,
    minSize: 0,
    maxSize: maxSize,
  });
  
  const handleChange = event => {
    setLicence(event.target.value);
  };
  const yourConfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  };
  //alert dialogue code
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleEditData = () => {
    setEditData(true);
  };

  const handleUploadData = () => {
    setUploadData(true);
    setOpen(true);
  };

  function datatoflask(event) {
    event.preventDefault();

    setError(false);
    const obj = {
      dataset_name: event.target.datasetname.value,
      description: event.target.description.value,
      creator: event.target.creator.value,
      contributor: event.target.contributor.value,
      collection_date: event.target.collection_date.value,
      licence: licence,
      language: event.target.language.value,
      // attribute: event.target.attribute.value,
      ignore_attribute: event.target.ignore_attribute.value,
      def_tar_att: event.target.def_tar_att.value,
      citation: event.target.citation.value
    };
    const json = JSON.stringify(obj);
    const blob = new Blob([json], {
      type: "application/json"
    });
    const data = new FormData();
    let dataset = event.target.dataset.files;

    data.append("dataset", dataset[0]);
    data.append("metadata", blob);
    console.log(data);
    if (uploaddata === true) {
      setError(false);
      axios
        .post(
          process.env.REACT_APP_URL_SITE_BACKEND + "data-upload",
          data,
          yourConfig
        )
        .then(function(response) {
          if (response.data.msg === "dataset uploaded") {
            setSuccess(true);
          }
          if (response.data.msg === "format not supported") {
            setErrorMessage("Data format not supported");
            setError(true);
          }
        })
        .catch(errors => console.log(errors));
    }

    if (editdata === true) {
      axios
        .post(
          process.env.REACT_APP_URL_SITE_BACKEND + "data-edit-upload",
          data,
          yourConfig
        )
        .then(function(response) {
          setEditPath(response.data.msg);
          console.log(response.data.msg);
          setEditSuccess(true);
        })
        .catch(errors => console.log(errors));
    }

    return false;
  }

  if (editsuccess === true) {
    return (
      <Card mb={6}>
        <iframe
          src={"/dashboard/data-upload?uuid=" + editpath}
          title="DashboardFrame"
          height="3300px"
          width="98%"
          frameBorder="0"
        />
      </Card>
    );
  } else {
    return (
      <form onSubmit={datatoflask}>
        <Typography variant="h1" gutterBottom>
          Dataset Upload
        </Typography>
        {error && (
          <Typography
            component="h3"
            variant="body1"
            align="center"
            color="red"
          >
            {errormessage}
          </Typography>
        )}
        <Grid container spacing={6}>
        <Grid item xs={12}>
          <DropCard variant="outlined">
            <div {...getRootProps()}>
              <input {...getInputProps()} id="dataset" />
              <Box display="flex" flex-direction="column" alignItems="center" justifyContent="center">
              <FontAwesomeIcon icon="cloud-upload-alt" size="2x" color={green[800]}/>
              </Box>
              <Box display="flex" flex-direction="column" alignItems="center" justifyContent="center">
              <Paragraph>Drag 'n' drop some files here, or click to select files.</Paragraph>
              </Box>                
              <Box display="flex" flex-direction="column" alignItems="center" justifyContent="center">
              <Paragraph>Currently we only support text based formats like csv and json</Paragraph>
              </Box>
            </div>
          </DropCard>
            {acceptedFiles.length > 0 && acceptedFiles.map(acceptedFile => (
              <Chip variant="outlined" label={acceptedFile.name} color="primary" />
            ))}
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="datasetname">Dataset name *</InputLabel>
              <Input id="datasetname" />
            </FormControl>

            <FormControl fullWidth mb={3}>
              <TextField
                label="Description *"
                id="description"
                rows={3}
                maxRows={4}
              />
            </FormControl>
            <FormControl fullWidth mb={3}>
              <TextField label="Creator" id="creator" rows={3} maxRows={4} />
            </FormControl>
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="contributor">Contributor(s)</InputLabel>
              <Input id="contributor" placeholder="Last name" />
            </FormControl>
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="Collection Date">
                Collection date
              </InputLabel>
              <Input id="collection_date" placeholder="Collection date" />
            </FormControl>
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="language">Language</InputLabel>
              <Input id="language" placeholder="Language" />
            </FormControl>
            <FormControl fullWidth mb={3}>
              <InputLabel id="licence">Licence Type</InputLabel>
              <select labelId="licence" id="licence" value={licence} onChange={handleChange}
              style={{padding: 15, marginTop: 50}}>
                <option value="Public Domain (CCO)">Public Domain (CCO)</option>
                <option value="Publicly available">Publicly available</option>
                <option value="Attribution (CC BY)">Attribution (CC BY)</option>
                <option value="Attribution-ShareAlike (CC BY-SA)">Attribution-ShareAlike (CC BY-SA)</option>
                <option value="Attribution-NoDerivs (CC BY-ND)">Attribution-NoDerivs (CC BY-ND)</option>
                <option value="Attribution-NonCommercial (CC BY-NC)">Attribution-NonCommercial (CC BY-NC)</option>
                <option value="Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)">Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)</option>
                <option value="Attribution-NonCommercial-NoDerivs (CC BY-NC-ND)">Attribution-NonCommercial-NoDerivs (CC BY-NC-ND)</option>
              </select>
            </FormControl>
            {/*<FormControl fullWidth mb={3}>*/}
            {/*    <InputLabel htmlFor="attribute">Attribute</InputLabel>*/}
            {/*    <Input*/}
            {/*        id="attribute"*/}
            {/*        placeholder="attribute"*/}
            {/*    />*/}
            {/*</FormControl>*/}
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="def_tar_att">
                Default target attribute
              </InputLabel>
              <Input id="def_tar_att" placeholder="def_tar_att" />
            </FormControl>
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="ignore_attribute">
                Ignore attribute
              </InputLabel>
              <Input id="ignore_attribute" placeholder="ignore attribute" />
            </FormControl>
            <FormControl fullWidth mb={3}>
              <InputLabel htmlFor="citation">Citation</InputLabel>
              <Input id="citation" placeholder="citation" />
            </FormControl>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          type="Submit"
          onClick={handleUploadData}
        >
          Upload dataset
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Your Dataset is uploading"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Your dataset is uploading, you can edit it via the dashboard later
              and share it with public.
              {error && <text> {errormessage}</text>}
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
        {success && <Redirect to="/" />}
        &nbsp;&nbsp;&nbsp;
        <Button
          variant="contained"
          color="primary"
          type="Submit"
          onClick={handleEditData}
        >
          Edit dataset
        </Button>
      </form>
    );
  }
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
