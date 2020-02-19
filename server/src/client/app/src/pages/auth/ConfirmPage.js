import React, {useState} from "react";
import styled from "styled-components";
import ReactDOM from "react-dom";
import {BrowserRouter as Router, Redirect, Route} from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";


import {
  FormControl,
  Input,
  InputLabel,
  Button as MuiButton,
  Paper,
  Typography
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import ResetPage from "./ResetPage";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;
  width: 100%;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

function Confirm() {
    const [verifToken, setverifToken] = useState(false);
    console.log(window.location.href)
    axios.post(process.env.REACT_APP_SERVER_URL+"confirmation",{
        url:window.location.href,
    }).then(function(response) {
        console.log(response.data);
        setverifToken(true);
      })
      .catch(function(error) {
        console.log(error.data);
      });
    return(
        <Wrapper>
          {verifToken ? (
          <Redirect to="/auth/sign-in" />
        ) : (
          <t></t>//dummy values for now todo: remove the
        )}
        </Wrapper>
        );

}
export default Confirm;