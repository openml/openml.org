import React from "react";
import styled from "styled-components";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import "swagger-ui-themes/themes/3.x/theme-material.css";

const StyledSwaggerUI = styled.div`
  [id^="model-"][id*="_"] {
    display: none;
  }
  [id^="model-"][id*="List"] {
    display: none;
  }
  [id^="model-"][id*="Unprocessed"] {
    display: none;
  }
  [id^="model-"][id*="Request"] {
    display: none;
  }
  [id^="model-"][id*="Trace"] {
    display: none;
  }
  .swagger-ui .scheme-container {
    background: inherit;
    box-shadow: none;
  }
  .swagger-ui section.models .model-container {
    background: inherit;
  }
  .swagger-ui .info {
    margin-bottom: 0px;
  }
  .swagger-ui .servers > label select {
    height: 40px;
  }
  .swagger-ui table.model tr.property-row td {
    padding: 0.6em;
    font-size: 12pt;
  }
  .swagger-ui table.model tr.property-row td:first-child {
    padding: 0.6em;
    font-size: 12pt;
  }
  .swagger-ui td .model .pointer .model-title {
    display: none;
  }
  .swagger-ui td .model-toggle {
    font-size: 20px;
    top: 2px;
    margin-left: 0px;
  }
  .swagger-ui td .brace-open {
    font-size: 16px;
  }
  .renderedMarkdown {
    color: #999;
  }
  .swagger-ui .opblock-tag {
    margin: 0px;
    background-color: #fff;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }
  .no-margin {
    display: flex;
    flex-direction: column;
  }
  .swagger-ui .opblock-get {
    padding-left: 5px;
    margin-bottom: 1px;
  }
  .swagger-ui .opblock-post {
    padding-left: 5px;
    margin-bottom: 1px;
    order: 2;
  }
  .swagger-ui .opblock-delete {
    padding-left: 5px;
    margin-bottom: 1px;
    order: 3;
  }
  .swagger-ui .opblock-summary {
    height: 50px;
  }
`;

function OpenMLSwaggerUI() {
  return (
    <StyledSwaggerUI>
      <SwaggerUI url="swagger.json" />
    </StyledSwaggerUI>
  );
}

export default OpenMLSwaggerUI;
