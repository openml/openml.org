import React, {useState} from "react";
import styled from "styled-components";
import axios from "axios";
import {Redirect} from "react-router-dom";

import {
    FormControl,
    Input,
    InputLabel,
    Button as MuiButton,
    Paper,
    Typography
} from "@mui/material";
import {spacing} from "@mui/system";


const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)};

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)};
  }
`;

function ResetPassword() {
    const [mail, setMail] = useState(false);

    function sendflask(event) {
        event.preventDefault();
        console.log("executed");
        axios
            .post(process.env.REACT_APP_URL_SITE_BACKEND + "forgotpassword", {
                email: event.target.email.value
            })
            .then(function (response) {
                console.log(response.data);
                setMail(true);
            })
            .catch(function (error) {
                console.log(error.data);
            });
    }

    return (
        <Wrapper>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
                Reset password
            </Typography>
            {mail && (
                <Redirect to='/auth/sign-in'/>
            )}
            <Typography component="h2" variant="body1" align="center">
                Please enter your email. We send you a link to reset your password.
            </Typography>
            <form onSubmit={sendflask}>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="email">Email Address</InputLabel>
                    <Input id="email" name="email" autoComplete="email" autoFocus/>
                </FormControl>
                <Button
                    type="Submit"
                    to=""
                    fullWidth
                    variant="contained"
                    color="primary"
                    mt={2}
                >
                    Reset password
                </Button>
            </form>
        </Wrapper>
    );
}

export default ResetPassword;
