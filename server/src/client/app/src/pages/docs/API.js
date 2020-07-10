import React from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

function OpenMLSwaggerUI() {
  return <SwaggerUI url="swagger.json" />;
}

export default OpenMLSwaggerUI;
