import React, {useState} from "react";
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

import {spacing} from "@material-ui/system";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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

    function feedbacktoflask(event) {
        event.preventDefault();
        axios.post(process.env.REACT_APP_SERVER_URL + "feedback", {
            email: event.target.email.value,
            feedback: event.target.feedback.value,
        })
            .then(response => {
                console.log(response.data);
            })
            return false;

    }



return (
    <Card mb={6}>
        <form onSubmit={feedbacktoflask}>
            <Typography variant="h6" gutterBottom>
                Feedback info
            </Typography>
            <Grid container spacing={6}>
                <Grid item md={8}>

                    <FormControl fullWidth mb={3}>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            multiline={true}
                        />
                    </FormControl>
                    <FormControl fullWidth mb={3}>
                        <InputLabel htmlFor="feedback">Message</InputLabel>
                        <Input
                            id="feedback"
                            placeholder="Message"
                            multiline={true}
                        />
                    </FormControl>
                </Grid>
            </Grid>

            <Button variant="contained" color="primary" type="Submit">
                Send feedback
            </Button>
        </form>
    </Card>
);
}

function Settings() {
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                Feedback
            </Typography>

            <Divider my={6}/>

            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <Public/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default Settings;