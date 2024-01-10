import React, {useState} from "react";
import styled from "styled-components";
import {Redirect} from "react-router-dom";
import axios from "axios";


import {
  Paper,
} from "@mui/material";


const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)};
  width: 100%;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)};
  }
`;

function Confirm() {
    const [verifToken, setverifToken] = useState(false);
    console.log(window.location.href)
    axios.post(process.env.REACT_APP_URL_SITE_BACKEND+"confirmation",{
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
          {verifToken && (
          <Redirect to="/auth/sign-in" />
        )}
        </Wrapper>
        );

}
export default Confirm;