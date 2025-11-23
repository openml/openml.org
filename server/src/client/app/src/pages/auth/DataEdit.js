import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  Button,
  Paper,
  FormControl as MuiFormControl,
  Grid,
  Input,
  InputLabel,
  TextField,
  Typography,
  Tooltip,
  Box,
  Tab,
  Tabs,
  Card,
  Link,
} from "@mui/material";
import { Alert } from "@mui/material";
import { spacing } from "@mui/system";
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { green } from "@mui/material/colors";
import ReactMarkdown from "react-markdown";

const FloatIcon = styled(FontAwesomeIcon)({
  cursor: "pointer",
  color: green[400],
});

const FormControl = styled(MuiFormControl)(spacing);

const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};
  margin-top: 20px;
  margin-bottom: 20px;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function DataEdit() {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
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
  //const [user_id, setUserId] = useState("");
  const [owner, setOwner] = useState(false);
  const [original_data_url, setODUrl] = useState("");
  const [paper_url, setPaperUrl] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const yourConfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    params: {
      url: window.location.href,
    },
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleChange = (event) => {
    setDescription(event.target.value);
    event.preventDefault();
  };

  useEffect(() => {
    async function fetchData() {
      // You can await here
      const yourConfig = {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        params: {
          url: window.location.href,
        },
      };
      const response = await axios(
        process.env.REACT_APP_URL_SITE_BACKEND + "data-edit",
        yourConfig,
      );

      //setUserId(response.data.user_id);
      setName(response.data.name);
      setDescription(response.data.description);
      setCreator(response.data.creator);
      setDate(response.data.date);
      setLanguage(response.data.language);
      setCitation(response.data.citation);
      setDefTatt(response.data.default_target_attribute);
      setRowIdatt(response.data.row_id_attribute);
      setIgnoreatt(response.data.ignore_attribute);
      setODUrl(response.data.original_data_url);
      setPaperUrl(response.data.paper_url);
      if (response.data.owner === "true") {
        setOwner(true);
      }
    }
    fetchData();
  }, []); // Or [] if effect doesn't need props or state

  function datatoflask(event) {
    event.preventDefault();
    if (owner === true) {
      axios
        .post(
          process.env.REACT_APP_URL_SITE_BACKEND + "data-edit",
          {
            owner: "true",
            description: event.target.description.value,
            creator: event.target.creator.value,
            date: event.target.collection_date.value,
            citation: event.target.citation.value,
            language: event.target.language.value,
            default_target_attribute:
              event.target.default_target_attribute.value,
            ignore_attribute: event.target.ignore_attribute.value,
            row_id_attribute: event.target.row_id_attribute.value,
            original_data_url: event.target.original_data_url.value,
            paper_url: event.target.paper_url.value,
          },
          yourConfig,
        )
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          setError(true);
          setErrorMessage("Cannot edit");
          console.log(error);
        });
    } else if (owner === false) {
      axios
        .post(
          process.env.REACT_APP_URL_SITE_BACKEND + "data-edit",
          {
            owner: "false",
            description: event.target.description.value,
            creator: event.target.creator.value,
            date: event.target.collection_date.value,
            citation: event.target.citation.value,
            language: event.target.language.value,
            original_data_url: event.target.original_data_url.value,
            paper_url: event.target.paper_url.value,
          },
          yourConfig,
        )
        .then(function (response) {
          console.log(response.data);
          setSuccess(true);
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
    <Grid container spacing={3} justifyContent="center">
      <Grid item md={7} xs={10}>
        <Wrapper>
          <form onSubmit={datatoflask}>
            <Typography variant="h1" gutterBottom>
              {"Edit " + name}
            </Typography>
            {error && <Alert severity="error">{errormessage}</Alert>}
            <Grid container spacing={10}>
              <Grid item xs={12}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                >
                  <Tab label="Description" key="markdown" />
                  <Tab label="Preview" key="preview" />
                </Tabs>
                {tabValue === 0 ? (
                  <FormControl fullWidth>
                    <TextField
                      onChange={handleChange}
                      variant="outlined"
                      label=""
                      id="description"
                      rows={15}
                      multiline
                      value={description}
                    />
                  </FormControl>
                ) : (
                  <Card variant="outlined">
                    <ReactMarkdown children={description} />
                  </Card>
                )}
                <div style={{ float: "right" }}>
                  <Tooltip
                    title="Styling with Markdown is supported"
                    placement="left"
                  >
                    <Link
                      target="_blank"
                      rel="noopener"
                      color="inherit"
                      href="https://guides.github.com/features/mastering-markdown/"
                    >
                      <FloatIcon icon={["fab", "markdown"]} size="lg" />
                    </Link>
                  </Tooltip>
                </div>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel shrink htmlFor="citation">
                    Citation
                  </InputLabel>
                  <Input
                    id="citation"
                    placeholder="citation"
                    defaultValue={citation}
                    multiline
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel shrink htmlFor="creator">
                    Creator
                  </InputLabel>
                  <Input
                    id="creator"
                    placeholder="creator"
                    defaultValue={creator}
                    multiline
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel shrink htmlFor="Collection Date">
                    Collection date
                  </InputLabel>
                  <Input
                    id="collection_date"
                    placeholder="Collection date"
                    defaultValue={date}
                    multiline
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel shrink htmlFor="language">
                    Language
                  </InputLabel>
                  <Input
                    id="language"
                    placeholder="Language"
                    defaultValue={language}
                    multiline
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel shrink htmlFor="original_data_url">
                    Original data URL
                  </InputLabel>
                  <Input
                    id="original_data_url"
                    placeholder="original_data_url"
                    defaultValue={original_data_url}
                    multiline
                  />
                </FormControl>
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel shrink htmlFor="paper_url">
                    Paper Url
                  </InputLabel>
                  <Input
                    id="paper_url"
                    placeholder="paper_url"
                    defaultValue={paper_url}
                    multiline
                  />
                </FormControl>
                {owner && (
                  <Box
                    p={1}
                    border="3px solid red"
                    borderRadius="5px"
                    padding={5}
                    marginTop={10}
                    marginBottom={10}
                  >
                    <b>Danger Zone (can only be edited by author)</b>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel shrink htmlFor="default_target_attribute">
                        default_target_attribute
                      </InputLabel>
                      <Input
                        id="default_target_attribute"
                        placeholder="default_target_attribute"
                        defaultValue={def_tar_att}
                        multiline
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel shrink htmlFor="ignore_attribute">
                        ignore_attribute
                      </InputLabel>
                      <Input
                        id="ignore_attribute"
                        placeholder="ignore_attribute"
                        defaultValue={ignore_att}
                        multiline
                      />
                    </FormControl>
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <InputLabel shrink htmlFor="row_id_attribute">
                        row_id_attribute
                      </InputLabel>
                      <Input
                        id="row_id_attribute"
                        placeholder="row_id_attribute"
                        defaultValue={row_id_att}
                        multiline
                      />
                    </FormControl>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Button variant="contained" color="primary" type="Submit">
              Edit Dataset
            </Button>

            {success && <Redirect to="/" />}
          </form>
        </Wrapper>
      </Grid>
    </Grid>
  );
}

export default DataEdit;
