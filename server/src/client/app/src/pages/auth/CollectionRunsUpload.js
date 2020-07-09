import React, {useState} from "react";
import styled from "styled-components";
import axios from "axios";
import {
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

import {spacing} from "@material-ui/system";
import {Redirect} from "react-router-dom";


const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);

function Public() {

    const [error, setError] = useState(false);
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
            .post(process.env.REACT_APP_SERVER_URL + "upload-collection-runs", {
                description: event.target.description.value,
                collectionname: event.target.collectionname.value,
                run_ids: event.target.runids.value,
                benchmark: event.target.benchmark.value,
            }, yourConfig)
            .then(function (response) {
                if (response.data.msg === "collection uploaded") {
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
                    Collection info
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
                                label="Related Task collection ID"
                                id="benchmark"
                                rows={3}
                                rowsMax={4}
                            />
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <TextField
                                label="RunIDs"
                                id="runids"
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
                Collection Runs Upload
            </Typography>
            <Divider my={3}/>

            <div>
                <Button color="primary" href='/auth/upload-collection-tasks'> Upload task collection</Button>
                <Button color="Blue" href='/auth/upload-collection-runs'> Upload run collection</Button>
            </div>
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
