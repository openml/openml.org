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
import Box from '@material-ui/core/Box';
import {spacing} from "@material-ui/system";
import {Redirect} from "react-router-dom";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);

function Public() {
    const [description, setDescription] = useState("");
    const [creator, setCreator] = useState("");
    const [date, setDate] = useState("");
    const [citation, setCitation] = useState("");
    const [language, setLanguage] = useState("");
    const [def_tar_att, setDefTatt] = useState("");
    const [row_id_att, setRowIdatt] = useState("");
    const [ignore_att, setIgnoreatt] = useState("");
    const [error, setError] = useState(false);
    const [errormessage, setErrorMessage] = useState(false);
    const [success, setSuccess] = useState(false);
    const [user_id, setUserId] = useState("");
    const [owner, setOwner] = useState(false);
    const yourConfig = {
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        params: {
            url: window.location.href,
        },


    };

    axios
        .get(process.env.REACT_APP_SERVER_URL + "data-edit", yourConfig)
        .then(function (response) {
            console.log(response.data);
            setUserId(response.data.user_id);
            setDescription(response.data.description);
            setCreator(response.data.creator);
            setDate(response.data.date);
            setLanguage(response.data.language);
            setCitation(response.data.citation);
            setDefTatt(response.data.default_target_attribute);
            setRowIdatt(response.data.row_id_attribute);
            setIgnoreatt(response.data.ignore_attribute);
            if (response.data.owner === 'true') {
                setOwner(true);
            }
        })
        .catch(function (error) {
            console.log(error);
        });

    function datatoflask(event) {
        event.preventDefault();
        if (owner === true) {
            axios
                .post(
                    process.env.REACT_APP_SERVER_URL + "data-edit",
                    {
                        owner: "true",
                        description: event.target.description.value,
                        creator: event.target.creator.value,
                        date: event.target.collection_date.value,
                        citation: event.target.citation.value,
                        language: event.target.language.value,
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
        }
        else if(owner === false)
        {
            axios
                .post(
                    process.env.REACT_APP_SERVER_URL + "data-edit",
                    {
                        owner: "false",
                        description: event.target.description.value,
                        creator: event.target.creator.value,
                        date: event.target.collection_date.value,
                        citation: event.target.citation.value,
                        language: event.target.language.value,
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

        }

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
                            <TextField
                                label="Description"
                                id="description"
                                rows={3}
                                multiline={true}
                                rowsMax={4}
                                defaultValue={description}
                            />
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="citation">Citation</InputLabel>
                            <Input id="citation" placeholder="citation" defaultValue={citation} multiline={true}/>
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <TextField label="Creator" id="creator" rows={3} rowsMax={4} defaultValue={creator}
                                       multiline={true}/>
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="Collection Date">
                                Collection date
                            </InputLabel>
                            <Input id="collection_date" placeholder="Collection date" defaultValue={date}
                                   multiline={true}/>
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="language">Language</InputLabel>
                            <Input id="language" placeholder="Language" defaultValue={language} multiline={true}/>
                        </FormControl>
                        {owner && (
                            <Box p={1} bgcolor="grey.300">
                                <b>Danger Zone(can only be edited by author)</b>
                                <FormControl fullWidth mb={3}>
                                    <InputLabel htmlFor="default_target_attribute">default_target_attribute</InputLabel>
                                    <Input id="default_target_attribute" placeholder="default_target_attribute"
                                           defaultValue={def_tar_att} multiline={true}/>
                                </FormControl>
                                <FormControl fullWidth mb={3}>
                                    <InputLabel htmlFor="ignore_attribute">ignore_attribute</InputLabel>
                                    <Input id="ignore_attribute" placeholder="ignore_attribute"
                                           defaultValue={ignore_att} multiline={true}/>
                                </FormControl>
                                <FormControl fullWidth mb={3}>
                                    <InputLabel htmlFor="row_id_attribute">
                                        row_id_attribute
                                    </InputLabel>
                                    <Input id="row_id_attribute" placeholder="row_id_attribute"
                                           defaultValue={row_id_att} multiline={true}/>
                                </FormControl>
                            </Box>
                        )}

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