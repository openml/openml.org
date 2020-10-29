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
    //todo set error messages for task uploads
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
                process.env.REACT_APP_SERVER_URL + "data-edit",
                {
                    dataset_id: event.target.dataset_id.value,
                    description: event.target.description.value,
                    creator: event.target.creator.value,
                    date: event.target.collection_date.value,
                    citation: event.target.citation.value,
                    language: event.target.language.value
                },
                yourConfig
            )
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                setError(true);
                setErrorMessage("Cannot edit");
                console.log(error.data);
            });

        return false;
    }

    return (
        <Card mb={6}>
            <form onSubmit={datatoflask}>
                <Typography variant="h6" gutterBottom>
                    Dataset Edit info
                </Typography>
                {error && (
                    <Typography component="h3" variant="body1" align="center" color="red">
                        {errormessage}
                    </Typography>
                )}
                <Grid container spacing={6}>
                    <Grid item md={8}>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="dataset_id">Dataset id</InputLabel>
                            <Input id="dataset_id"/>
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
                            <InputLabel htmlFor="citation">Citation</InputLabel>
                            <Input id="citation" placeholder="citation"/>
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <TextField label="Creator" id="creator" rows={3} rowsMax={4}/>
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="contributor">Contributor(s)</InputLabel>
                            <Input id="contributor" placeholder="Last name"/>
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="Collection Date">
                                Collection date
                            </InputLabel>
                            <Input id="collection_date" placeholder="Collection date"/>
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="language">Language</InputLabel>
                            <Input id="language" placeholder="Language"/>
                        </FormControl>
                    </Grid>
                </Grid>

                <Button variant="contained" color="primary" type="Submit">
                    Edit Dataset
                </Button>

                {success && <Redirect to="/"/>}
            </form>
        </Card>
    );
}

function Settings() {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Edit Dataset
            </Typography>
            <Divider my={3}/>

            <div>
                <Button color="primary" href="/auth/data-edit">
                    {" "}
                    Edit dataset
                </Button>
                <Button color="Blue" href="/auth/data-edit-critical">
                    {" "}
                    Edit critical fields of a dataset
                </Button>
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