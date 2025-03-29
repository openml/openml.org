import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import {
  FormControl,
  Button as MuiButton,
  Typography,
  Tooltip, 
  IconButton
} from "@mui/material";
import { spacing } from "@mui/system";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const Button = styled(MuiButton)(spacing);

function CopyableAPIKey({ apikey }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apikey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500); // Hide tooltip after 1.5s
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Typography variant="body1" id="api-key" sx={{ wordBreak: "break-all" }}>
        {apikey || "Loading..."}
      </Typography>
      {apikey && (
        <Tooltip title={copied ? "Copied!" : "Copy"} arrow>
          <IconButton size="small" onClick={handleCopy}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}

function APIKey() {
  const [apikey, setApikey] = useState('');
  const yourConfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  };

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_URL_SITE_BACKEND + "api-key", yourConfig)
      .then((response) => {
        setApikey(response.data.apikey);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function resetApiKey(event) {
    event.preventDefault();
    axios
      .post(
        process.env.REACT_APP_URL_SITE_BACKEND + "api-key",
        { resetapikey: true },
        yourConfig
      )
      .then((response) => {
        setApikey(response.data.apikey); // Refresh it immediately
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <React.Fragment>
      <Typography variant="h4" align="center" gutterBottom>
        API Key
      </Typography>
      <Typography variant="h6" align="center" gutterBottom>
        Keep it secret, keep it safe!
      </Typography>
      <form onSubmit={resetApiKey}>
        <FormControl margin="normal" required fullWidth>
          <CopyableAPIKey apikey={apikey}/>
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          mt={2}
        >
          Reset API Key
        </Button>
      </form>
    </React.Fragment>
    );
}

export default APIKey;