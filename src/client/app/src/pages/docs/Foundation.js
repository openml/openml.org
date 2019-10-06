import React from "react";
import styled from "styled-components";

import {
  Card as MuiCard,
  CardContent,
  Divider as MuiDivider,
  Grid,
  Paper,
  Typography as MuiTypography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Card = styled(MuiCard)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const MainPaper= styled(Paper)`
  flex: 1;
  background: ${props => props.bg === 'Gradient' ? 'transparent' : props.theme.body.background};
  padding: 40px;
`;

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
    <MainPaper>
      <Typography variant="h3" gutterBottom display="inline">
        Foundation
      </Typography>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Placeholder />
          </Grid>
      </Grid>
    </MainPaper>
    </React.Fragment>
  );
}

export default BlankDocs;
