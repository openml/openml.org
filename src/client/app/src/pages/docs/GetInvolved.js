import React from "react";
import styled from "styled-components";

import {
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  Grid,
  Typography as MuiTypography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Placeholder() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Card
        </Typography>
        <Typography variant="body1" gutterBottom my={4}>
          Contents
        </Typography>
      </CardContent>
    </Card>
  );
}


function BlankDocs() {
  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom display="inline">
        Get Involved
      </Typography>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Placeholder />
          </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default BlankDocs;
