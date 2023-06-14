import React from "react";
import styled from "@emotion/styled";
import NextLink from "next/link";
import { Helmet } from "react-helmet-async";

import DashboardLayout from "../layouts/Dashboard";

import {
  Avatar,
  Breadcrumbs as MuiBreadcrumbs,
  Button,
  Card as MuiCard,
  CardActions,
  CardContent as MuiCardContent,
  CardMedia as MuiCardMedia,
  Chip as MuiChip,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography as MuiTypography,
} from "@mui/material";
import { AvatarGroup as MuiAvatarGroup } from "@mui/material";
import { spacing } from "@mui/system";

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  border-bottom: 1px solid ${(props) => props.theme.palette.grey[300]};
`;

const CardMedia = styled(MuiCardMedia)`
  height: 220px;
`;

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
`;

const AvatarGroup = styled(MuiAvatarGroup)`
  margin-left: ${(props) => props.theme.spacing(2)};
`;

const Project = ({ image, title, description, chip }) => {
  return (
    <Card>
      {image ? <CardMedia image={image} title="Contemplative Reptile" /> : null}
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {title}
        </Typography>

        {chip}

        <Typography mb={4} color="textSecondary" component="p">
          {description}
        </Typography>

        <AvatarGroup max={3}>
          <Avatar alt="Avatar" src="/static/img/avatars/avatar-1.jpg" />
          <Avatar alt="Avatar" src="/static/img/avatars/avatar-2.jpg" />
          <Avatar alt="Avatar" src="/static/img/avatars/avatar-3.jpg" />
        </AvatarGroup>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          Share
        </Button>
        <Button size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

function Projects() {
  return (
    <React.Fragment>
      <Helmet title="Projects" />

      <Typography variant="h3" gutterBottom display="inline">
        APIs
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <NextLink href="/" passHref>
          <Link>Dashboard</Link>
        </NextLink>
        <NextLink href="/" passHref>
          <Link>Pages</Link>
        </NextLink>
        <Typography>Projects</Typography>
      </Breadcrumbs>

      <Divider my={6} />

      <Grid container spacing={6}>
        <Grid item xs={12} lg={6} xl={3}>
          <Project
            title="Landing page redesign"
            description="Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum."
            chip={<Chip label="Finished" color="success" />}
          />
        </Grid>
        <Grid item xs={12} lg={6} xl={3}>
          <Project
            title="Company posters"
            description="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa."
            chip={<Chip label="In progress" color="warning" />}
          />
        </Grid>
        <Grid item xs={12} lg={6} xl={3}>
          <Project
            title="Product page design"
            description="Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum."
            chip={<Chip label="Finished" color="success" />}
          />
        </Grid>
        <Grid item xs={12} lg={6} xl={3}>
          <Project
            title="Upgrade CRM software"
            description="Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris."
            chip={<Chip label="In progress" color="warning" />}
          />
        </Grid>
        <Grid item xs={12} lg={6} xl={3}>
          <Project
            title="Fix form validation"
            description="Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris."
            chip={<Chip label="In progress" color="warning" />}
            image="/static/img/unsplash/unsplash-1.jpg"
          />
        </Grid>
        <Grid item xs={12} lg={6} xl={3}>
          <Project
            title="New company logo"
            description="Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum."
            chip={<Chip label="On hold" color="error" />}
            image="/static/img/unsplash/unsplash-2.jpg"
          />
        </Grid>
        <Grid item xs={12} lg={6} xl={3}>
          <Project
            title="Upgrade to latest Maps API"
            description="Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris."
            chip={<Chip label="Finished" color="success" />}
            image="/static/img/unsplash/unsplash-3.jpg"
          />
        </Grid>
        <Grid item xs={12} lg={6} xl={3}>
          <Project
            title="Refactor backend templates"
            description="Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo. Maecenas malesuada. Praesent congue erat at massa."
            chip={<Chip label="On hold" color="error" />}
            image="/static/img/unsplash/unsplash-4.jpg"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

Projects.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Projects;
