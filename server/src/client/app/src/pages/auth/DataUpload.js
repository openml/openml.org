import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  Avatar,
  Button,
  Card as MuiCard,
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
import { Redirect } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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
  const [error, setError] = useState(false);
  const [errormessage, setErrorMessage] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editdata, setEditData] = useState(false);
  const [uploaddata, setUploadData] = useState(false);
  const [editpath, setEditPath] = useState(false);
  const [editsuccess, setEditSuccess] = useState(false);
  const [licence, setLicence] = useState("");

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
      licence: event.target.licence.value,
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
          process.env.REACT_APP_SERVER_URL + "data-upload",
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
          process.env.REACT_APP_SERVER_URL + "data-edit-upload",
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
      <Card mb={6}>
        <form onSubmit={datatoflask}>
          <Typography variant="h6" gutterBottom>
            Dataset info
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
            <Grid item md={8}>
              <FormControl fullWidth mb={3}>
                <InputLabel htmlFor="datasetname">Dataset name</InputLabel>
                <Input id="datasetname" />
              </FormControl>

              <FormControl fullWidth mb={3}>
                <TextField
                  label="Description"
                  id="description"
                  rows={3}
                  rowsMax={4}
                />
              </FormControl>
              <FormControl fullWidth mb={3}>
                <TextField label="Creator" id="creator" rows={3} rowsMax={4} />
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
                <Select
                  labelId="licence"
                  id="licence"
                  value={licence}
                  onChange={handleChange}
                >
                  <MenuItem value={"Public Domain (CCO)"}>
                    Public Domain (CCO)
                  </MenuItem>
                  <MenuItem value={"Publicly available"}>
                    Publicly available
                  </MenuItem>
                  <MenuItem value={"Attribution (CC BY)"}>
                    Attribution (CC BY)
                  </MenuItem>
                  <MenuItem value={"Attribution-ShareAlike (CC BY-SA)"}>
                    Attribution-ShareAlike (CC BY-SA)
                  </MenuItem>
                  <MenuItem value={"Attribution-NoDerivs (CC BY-ND)"}>
                    Attribution-NoDerivs (CC BY-ND)
                  </MenuItem>
                  <MenuItem value={"Attribution-NonCommercial (CC BY-NC)"}>
                    Attribution-NonCommercial (CC BY-NC)
                  </MenuItem>
                  <MenuItem
                    value={"Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)"}
                  >
                    Attribution-NonCommercial-ShareAlike (CC BY-NC-SA)
                  </MenuItem>
                  <MenuItem
                    value={"Attribution-NonCommercial-NoDerivs (CC BY-NC-ND)"}
                  >
                    Attribution-NonCommercial-NoDerivs (CC BY-NC-ND)
                  </MenuItem>
                </Select>
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
            <Grid item md={4}>
              <CenteredContent>
                <BigAvatar alt="User Image" id="dp" />
                <input style={{ display: "none" }} id="dataset" type="file" />
                <label htmlFor="dataset">
                  <Button variant="contained" color="primary" component="span">
                    <FAIcon icon="cloud-upload-alt" mr={2} /> Upload
                  </Button>

                  <Typography variant="caption" display="block" gutterBottom>
                    Currently we only support text based formats like csv and
                    json
                  </Typography>
                </label>
              </CenteredContent>
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
                Your dataset is uploading, you can edit it via dashboard later
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
            Edit dataset (In progress)
          </Button>
        </form>
      </Card>
    );
  }
}

function Settings() {
  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom display="inline">
        Dataset Upload
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
