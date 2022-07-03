import React, {useState} from "react";
import styled from "styled-components";
import axios from "axios";


import {
    FormControl,
    InputLabel,
    Button as MuiButton,
    Paper,
    Typography
} from "@mui/material";
import {spacing} from "@mui/system";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)};
  width: 100%;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)};
  }
`;

const yourConfig = {
    headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
    }
}

function APIKey() {
    const [apikey, setApikey] = useState(false);
    axios.get(process.env.REACT_APP_SERVER_URL + "api-key", yourConfig)
        .then(function (response) {
            console.log(response);
            setApikey(response.data.apikey);
        })
        .catch(function (error) {
            console.log(error);
        });

    function apiFlask(event) {
        event.preventDefault();
        axios
            .post(process.env.REACT_APP_SERVER_URL + "api-key", {
                resetapikey:true
            }, yourConfig)
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                console.log(error.data);
            });
        return false;
    }

    return (
        <Wrapper>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
                API Key
            </Typography>
            <Typography component="h2" variant="body1" align="center">
            </Typography>
            <form onSubmit={apiFlask}>
                <FormControl margin="normal" required fullWidth>
                    <InputLabel htmlFor="email">API-key</InputLabel>
                    {apikey}
                </FormControl>
                <Button
                    type="Submit"
                    to=""
                    fullWidth
                    variant="contained"
                    color="primary"
                    mt={2}
                >
                    Reset API-Key
                </Button>
            </form>
        </Wrapper>
    );
}

export default APIKey;