import React from "react";
import ReactMarkdown from "react-markdown";
import { Grid, Card, CardContent, Typography } from "@material-ui/core";

export class TaskTypeItem extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1 className={"sectionTitle"}>
          <span className={"fa fa-flag fa-lg"} />
          {this.props.object.name}
        </h1>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4" mb={6}>
                Description
              </Typography>
              <div className="contentSection">
                <ReactMarkdown
                  source={this.props.object.description}
                  skipHtml
                />
              </div>
            </CardContent>
          </Card>
        </Grid>
        <h2>Definition</h2>
        <div className={"subtitle"}>
          Task type visualization not currently supported
        </div>
      </React.Fragment>
    );
  }
}
