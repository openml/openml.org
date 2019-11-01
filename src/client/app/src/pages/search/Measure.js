import React from "react";

export class MeasureItem extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h1 className={"sectionTitle"}>
          <span className={"fa fa-flag fa-lg"} />
          {this.props.object.name}
        </h1>
        {this.props.object.description}
        <h2>Definition</h2>
        <div className={"subtitle"}>
          Measure visualization not currently supported
        </div>
      </React.Fragment>
    );
  }
}
