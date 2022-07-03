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
    Typography
} from "@mui/material";

import {spacing} from "@mui/system";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const FormControl = styled(MuiFormControl)(spacing);


function Public() {
    const [msg, setMessage] = useState(false);

    function feedbacktoflask(event) {
        event.preventDefault();
        axios
            .post(process.env.REACT_APP_SERVER_URL + "feedback", {
                email: event.target.email.value,
                feedback: event.target.feedback.value,
            })
            .then(response => {
                console.log(response.data);
                if (response.data.msg === "Email sent") {
                    setMessage(true);
                }
            })
            .catch(error => {
                console.log(error);
            });
        return false;

    }


    return (
        <Card mb={6}>
            <form onSubmit={feedbacktoflask}>
                <Typography variant="h6" gutterBottom>
                    Feedback info
                </Typography>
                <Typography variant="h7" gutterBottom>
                    You can also create a github issue at <a href="https://github.com/openml/OpenML">https://github.com/openml/OpenML</a>
                </Typography>
                {msg && (
                    <Typography component="h3" align="center" style={{color: "green"}}>
                        Thank you. We’ll get back to you </Typography>
                )}
                <Grid container spacing={6}>
                    <Grid item md={8}>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="feedback">Message</InputLabel>
                            <Input
                                id="feedback"
                                placeholder="Message"
                                multiline={true}
                            />
                        </FormControl>
                        <FormControl fullWidth mb={3}>
                            <InputLabel htmlFor="email">Email(Optional)</InputLabel>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
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