import React from "react";
import styled from "styled-components";

import {
  Grid,
  Hidden,
  List,
  ListItemText,
  ListItem as MuiListItem
} from "@material-ui/core";

const Wrapper = styled.div`
  padding: ${props => props.theme.spacing(1) / 4}px
    ${props => props.theme.spacing(4)}px;
  background: ${props => props.theme.palette.common.white};
  position: relative;
`;

const ListItem = styled(MuiListItem)`
  display: inline-block;
  width: auto;
  padding-left: ${props => props.theme.spacing(2)}px;
  padding-right: ${props => props.theme.spacing(2)}px;

  &,
  &:hover,
  &:active {
    color: #000;
  }
`;

function Footer() {
  return (
    <Wrapper>
      <Grid container spacing={0}>
        <Hidden smDown>
          <Grid container item xs={12} md={6}>
            <List>
              <ListItem component="a" href="#">
                <ListItemText primary="Support" />
              </ListItem>
            </List>
          </Grid>
        </Hidden>
        <Grid container item xs={12} md={6} justifyContent="flex-end">
          <List>
            <ListItem>
              <ListItemText primary="OpenML" />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Wrapper>
  );
}

export default Footer;
