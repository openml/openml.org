import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { red } from "@mui/material/colors";
import { Redirect } from "react-router-dom";
import { useState } from "react";

import {
  FormControl,
  IconButton,
  Input,
  InputLabel,
  InputAdornment,
  Button as MuiButton,
  Paper,
  Typography
} from "@mui/material";
import {
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { spacing } from "@mui/system";
import axios from "axios";

const Button = styled(MuiButton)(spacing);

const Wrapper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)};

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)};
  }
`;

const RedIcon = styled(FontAwesomeIcon)({
  color: red[500]
});

function SignUp() {
  const [register, setRegister] = useState(false);
  const [duplicateUser, setDuplicateUser] = useState(false);
  const [error, setError] = useState(false);
  const [errormessage, setErrorMessage] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    var registrationData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: password
    };

    console.log("Registration data: ", registrationData);

    if (password.length < 8) {
     // Password must be 8+ characters
      setError(true);
      setErrorMessage("Password too weak. Use at least 8 characters, with numbers, digits, and special characters.");
    } else if ( (/[a-zA-Z0-9]+@(?:[a-zA-Z0-9-]+\.)+[A-Za-z]+$/.test(email)) === false) {
      // Email must be in valid format
      setError(true);
      setErrorMessage("Please enter valid email");
    } else {
      sendflask(registrationData);
    }

    return false;
  }

  function handleMouseDownPassword(event) {
    event.preventDefault(); // Prevents focus loss
  }

  function handleClickShowPassword() {
    setShowPassword(function(prev) {
      return !prev;
    });
  }

  function sendflask(registrationData) {
    axios
      .post(process.env.REACT_APP_URL_SITE_BACKEND + "signup", {
        first_name: registrationData.firstName,
        last_name: registrationData.lastName,
        email: registrationData.email,
        password: registrationData.password
      })
      .then(function(response) {
        if (response.data.msg === "User created") {
          console.log(response.data);
          setRegister(true);
        } else if (response.data.msg === "User alredy exists") {
          setDuplicateUser(true);
        }
      })
      .catch(function(error) {
        console.log(error.data);
      })
  }

  return (
    <Wrapper>
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Almost there
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* Error Banner */}
        {duplicateUser && (
          <Typography component="h3" variant="body1" align="center" color="red">
            User already exists
          </Typography>
        )}
        {error && (
          <Typography component="h3" variant="body1" align="center" color="red">
            {errormessage}
          </Typography>
        )}

        {/* Input fields */}
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="fname">First name</InputLabel>
          <Input
            id="fname"
            name="fname"
            value={firstName}
            onChange={function(e) { setFirstName(e.target.value); }}
            autoFocus
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="lname">Last name</InputLabel>
          <Input
            id="lname"
            name="lname"
            value={lastName}
            onChange={function(e) { setLastName(e.target.value); }}
            autoFocus
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="email">
            Email Address (we never share your email)
          </InputLabel>
          <Input
            id="email"
            name="email"
            value={email}
            onChange={function(e) { setEmail(e.target.value); }}
            autoComplete="email"
          />
        </FormControl>
        <FormControl margin="normal" required fullWidth>
          <InputLabel htmlFor="password">
            Password (min 8 characters)
          </InputLabel>
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            onChange={function(e) {setPassword(e.target.value)}}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          mt={2}
          style={{ marginTop: 20 }}
        >
          Sign up for OpenML
        </Button>
        {register ? (
          <Redirect to="/auth/sign-in" />
        ) : (
          <Redirect to="/auth/sign-up" />
        )}
      </form>
      <p>
        You will receive an email to confirm your account. If you don't receive
        it, please check your spam folder. 
      </p>
      <p>
        <RedIcon icon="exclamation-triangle" /> By joining, you agree to the{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://docs.openml.org/intro/terms/"
        >
          Honor Code and Terms of Use
        </a>
        .
      </p>
    </Wrapper>
  );
}

export default SignUp;
