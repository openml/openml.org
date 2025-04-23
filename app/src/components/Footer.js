import React from "react";
import styled from "@emotion/styled";

import {
  Grid,
  List,
  ListItemText as MuiListItemText,
  ListItemButton as MuiListItemButton,
} from "@mui/material";

const Wrapper = styled.div`
  padding: ${(props) => props.theme.spacing(0.25)}
    ${(props) => props.theme.spacing(4)};
  background: ${(props) => props.theme.footer.background};
  position: relative;
`;

const ListItemButton = styled(MuiListItemButton)`
  display: inline-block;
  width: auto;
  padding-left: ${(props) => props.theme.spacing(4)};
  padding-right: ${(props) => props.theme.spacing(4)};

  &,
  &:hover,
  &:active {
    color: #ff0000;
  }
`;

const ListItemText = styled(MuiListItemText)`
  span {
    color: ${(props) => props.theme.footer.color};
  }
`;

function Footer() {
  return (
    <Wrapper>
      <Grid container spacing={0}>
        <Grid
          sx={{ display: { xs: "none", md: "block" } }}
          container
          size={{
            xs: 12,
            md: 6
          }}>
          <List>
            <ListItemButton component="a" href="apis">
              <ListItemText primary="APIs" />
            </ListItemButton>
            <ListItemButton component="a" href="contribute">
              <ListItemText primary="Contribute" />
            </ListItemButton>
            <ListItemButton component="a" href="meet">
              <ListItemText primary="Meet up" />
            </ListItemButton>
            <ListItemButton component="a" href="about">
              <ListItemText primary="About us" />
            </ListItemButton>
            <ListItemButton component="a" href="terms">
              <ListItemText primary="Terms and Citation" />
            </ListItemButton>
          </List>
        </Grid>
        <Grid
          container
          justifyContent="flex-end"
          size={{
            xs: 12,
            md: 6
          }}>
          <List>
            <ListItemButton>
              <ListItemText
                primary={`© ${new Date().getFullYear()} - OpenML`}
              />
            </ListItemButton>
          </List>
        </Grid>
      </Grid>
    </Wrapper>
  );
}

export default Footer;
