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
  .swagger-ui .wrapper:nth-of-type(2n):before {
    content: "Actions";
    font-size: 18pt;
    color: #3b4151;
    font-weight: 600;
  }
  #operations-tag-data {
    margin-top: 20px;
  }
  .swagger-ui .scheme-container {
    direction: rtl;
    display: flex;
    justify-content: flex-end;
    padding: 0;
  }
  .swagger-ui section.schemes {
    margin-left: auto;
  }
  .swagger-ui .servers {
    width: 320px;
  }
  .swagger-ui .servers > label {
    margin: 0;
  }
  .swagger-ui section.models .model-container {
    background: white;
    margin: 0;
    border-bottom: 1px solid rgba(59, 65, 81, 0.3);
    border-radius: 0px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
  }

  .swagger-ui section.models .model-container:last-of-type {
    margin: 0;
  }
  .swagger-ui section.models.is-open {
    padding: 0px;
  }
  .swagger-ui section.models {
    border: none;
  }
  .swagger-ui section.models h4 {
    margin-bottom: 10px;
    font-size: 18pt;
    color: #3b4151;
    font-weight: 600;
  }
  .swagger-ui section.models.is-open h4 {
    margin-top: 20px;
    margin-bottom: 0px;
    border-bottom: 0px;
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
  .swagger-ui .model-box {
    padding-top: 7px;
    padding-left: 5px;
    padding-bottom: 7px;
  }
  .swagger-ui .model-title {
    font-size: 12pt;
    color: rgb(59, 65, 81);
    text-transform: lowercase;
  }
  .swagger-ui .model-title__text {
    padding-left: 10px;
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
  .swagger-ui .opblock-tag-section h4 {
    padding-left: 20px;
    font-size: 12pt;
    height: 50px;
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
