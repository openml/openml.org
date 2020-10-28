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
                process.env.REACT_APP_SERVER_URL + "data-edit-critical",
                {
                    dataset_id: event.target.dataset_id.value,
                    default_target_attribute: event.target.default_target_attribute.value,
                    ignore_attribute: event.target.ignore_attribute.value,
                    row_id_attribute: event.target.row_id_attribute.value
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
                            <InputLabel htmlFor="default_target_attribute">default_target_attribute</InputLabel>
                            <Input id="default_target_attribute" placeholder="default_target_attribute"/>
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="ignore_attribute">ignore_attribute</InputLabel>
                            <Input id="ignore_attribute" placeholder="ignore_attribute"/>
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="row_id_attribute">
                                row_id_attribute
                            </InputLabel>
                            <Input id="row_id_attribute" placeholder="row_id_attribute"/>
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