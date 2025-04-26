import React from "react";
import { styled } from "@mui/material/styles";

import { spacing } from "@mui/system";
import {
  Avatar as MuiAvatar,
  Container as MuiContainer,
  Grid,
  Typography,
} from "@mui/material";

const Wrapper = styled("div")(spacing, ({ theme }) => ({
  background: theme.palette.background.paper,
  textAlign: "center",
}));

const Container = styled(MuiContainer)`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Avatar = styled(MuiAvatar)`
  ${spacing};
  width: 48px;
  height: 48px;
`;

const AvatarWrapper = styled("div")(({ theme }) => ({
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: theme.spacing(3),
}));

function Testimonial() {
  return (
    <Wrapper pt={10} pb={20}>
      <Container>
        <Grid container alignItems="center" justifyContent="center">
          <Grid
            size={{
              xs: 12,
              md: 8,
            }}
          >
            <Typography variant="h2" component="h3" gutterBottom>
              &quot;OpenML is the easiest way to get access to thousands of
              machine learning datasets&quot;
            </Typography>
            <AvatarWrapper>
              <a
                href="https://twitter.com/joavanschoren"
                target="_blank"
                rel="nofollow noreferrer noopener"
              >
                <Avatar src="/static/img/avatars/avatar-1.jpg" mr={3} />
              </a>
              <Typography color="textSecondary" variant="body2">
                Joaquin Vanschoren,
                <br />
                Co-Founder OpenML
              </Typography>
            </AvatarWrapper>
          </Grid>
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default Testimonial;
