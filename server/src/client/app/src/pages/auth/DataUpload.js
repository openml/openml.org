import React, {useState} from "react";
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

import {spacing} from "@material-ui/system";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {func} from "prop-types";
import {Redirect} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
    const yourConfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    }
    //alert dialogue code
    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    function datatoflask(event) {
        event.preventDefault();


        setError(false);
        const obj = {
            dataset_name: event.target.datasetname.value,
            description: event.target.description.value,
            creator: event.target.creator.value,
            contributor: event.target.contributor.value,
            collection_date: event.target.collection_date.value,
        };
        const json = JSON.stringify(obj);
        const blob = new Blob([json], {
            type: 'application/json'
        });
        const data = new FormData();
        let dataset = event.target.dataset.files

        data.append('dataset', dataset[0]);
        data.append('metadata', blob)

        axios.post(process.env.REACT_APP_SERVER_URL + "data-upload", data, yourConfig)
            .then(function (response) {
                if (response.data.msg == 'data uploaded') {
                    setSuccess(true)
                }

            })
            .catch(errors => console.log(errors));

        return false;
    }

    return (
        <Card mb={6}>
            <form onSubmit={datatoflask}>
                <Typography variant="h6" gutterBottom>
                    Dataset info
                </Typography>
                {
                    error &&
                    (
                        <Typography component="h3" variant="body1" align="center" color="red">
                            {errormessage}
                        </Typography>
                    )
                }
                <Grid container spacing={6}>
                    <Grid item md={8}>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="datasetname">Dataset name</InputLabel>
                            <Input id="datasetname"/>
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
                            <TextField
                                label="Creator"
                                id="creator"
                                rows={3}
                                rowsMax={4}
                            />
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="Contributor(s)">Contributor(s)</InputLabel>
                            <Input
                                id="contributor"
                                placeholder="Last name"
                            />
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="Collection Date">Collection date</InputLabel>
                            <Input
                                id="collection_date"
                                type="email"
                                placeholder="Collection date"
                            />
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="Collection Date">Collection date</InputLabel>
                            <Input
                                id="collection_date"
                                type="email"
                                placeholder="Collection date"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={4}>
                        <CenteredContent>
                            <BigAvatar alt="User Image" id="dp"/>
                            <input
                                style={{display: "none"}}
                                id="dataset"
                                type="file"
                            />
                            <label htmlFor="dataset">
                                <Button variant="contained" color="primary" component="span">
                                    <FAIcon icon="cloud-upload-alt" mr={2}/> Upload
                                </Button>

                                <Typography variant="caption" display="block" gutterBottom>
                                    Currently we only support text based formats like csv and json
                                </Typography>
                            </label>
                        </CenteredContent>
                    </Grid>
                </Grid>
                {success && (
                    <Redirect to="/auth/sign-in"/>
                )}
                <Button variant="contained" color="primary" type="Submit" onClick={handleClickOpen}>
                    Upload dataset
                </Button>
                <Dialog open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{"Your Dataset has been uploaded"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Your dataset has been uploaded, you can edit it via dashboard later and share it with public.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={handleClose} color="primary" href='/'>
                        Ok
                    </Button>
                    </DialogActions>
                </Dialog>

                &nbsp;&nbsp;&nbsp;
                <Button variant="contained" color="primary" type="Submit">
                    Edit dataset
                </Button>
            </form>
        </Card>
    );
}


function Settings() {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Dataset Upload
            </Typography>

            <Divider my={6}/>

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Public/>
                    {/*<Private />*/}
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Settings;
