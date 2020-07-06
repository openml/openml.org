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

import {spacing} from "@material-ui/system";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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

    const [error, setError] = useState(false);
    //todo set error messages for task uploads
    const [errormessage, setErrorMessage] = useState(false);
    const [success, setSuccess] = useState(false);


    const yourConfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        }
    }

    function datatoflask(event) {
        event.preventDefault();

        axios
            .post(process.env.REACT_APP_SERVER_URL + "upload-collection-tasks", {
                description: event.target.description.value,
                collectionname: event.target.collectionname.value,
                taskids: event.target.taskids.value,
            }, yourConfig)
            .then(function (response) {
                if (response.data.msg == "collection uploaded") {
                    setSuccess(true)
                }
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error.data);
            });

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
                            <InputLabel htmlFor="collectionname">Collection name</InputLabel>
                            <Input id="collectionname"/>
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
                                label="Task IDs"
                                id="taskids"
                                rows={3}
                                rowsMax={4}
                            />
                        </FormControl>

                    </Grid>
                </Grid>

                <Button variant="contained" color="primary" type="Submit">
                    Upload Collection
                </Button>

                {success && (
                    <Redirect to="/"/>
                )}
            </form>
        </Card>
    );
}

function Settings() {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Collection Tasks Upload
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
