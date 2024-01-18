import styled from "@emotion/styled";

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
  .swagger-ui,
  .swagger-ui *,
  .swagger-ui .info .title,
  .swagger-ui .info p,
  .swagger-ui .info li,
  .swagger-ui select,
  .swagger-ui .opblock *,
  .swagger-ui .opblock .opblock-section-header * {
    color: ${(props) => props.theme.palette.text.primary};
  }

  .swagger-ui .info a {
    color: ${(props) => props.theme.palette.text.secondary};
  }
  .swagger-ui select,
  .swagger-ui .opblock,
  .swagger-ui .opblock-tag,
  .swagger-ui section.models .model-container,
  .swagger-ui .opblock .opblock-section-header {
    background-color: ${(props) => props.theme.palette.background.paper};
  }
  .swagger-ui .model,
  .swagger-ui table.model tr.property-row td {
    font-size: 10pt !important;
  }
  .swagger-ui .model-title {
    font-size: 12pt !important;
  }
  .swagger-ui .model-toggle:after {
    background: ${(props) =>
      `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='${encodeURIComponent(
        props.theme.name == "DARK"
          ? props.theme.palette.primary.contrastText
          : "#000",
      )}' d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/%3E%3C/svg%3E") 50% no-repeat`};
  }
  .swagger-ui .expand-methods svg,
  .swagger-ui .opblock svg,
  .swagger-ui .expand-operation svg {
    fill: ${(props) =>
      props.theme.name == "DARK"
        ? props.theme.palette.primary.contrastText
        : "#000"};
  }
  .swagger-ui .scheme-container {
    background: inherit;
    box-shadow: none;
  }
  .swagger-ui .wrapper:nth-of-type(2n):before {
    content: "Actions";
    font-size: 18pt;
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
    margin: 0;
    border-bottom: 1px solid rgba(59, 65, 81, 0.3);
    border-radius: 0px;
    box-shadow:
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 1px 5px 0 rgba(0, 0, 0, 0.12);
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
  .swagger-ui td .model .pointer .model-title {
    display: none;
  }
  .swagger-ui .model-box {
    padding-top: 7px;
    padding-left: 5px;
    padding-bottom: 7px;
  }
  .swagger-ui .model,
  .model-title {
    font-size: 12pt;
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
  }
  .swagger-ui .opblock-tag {
    margin: 0px;
    box-shadow:
      0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.2),
      0 1px 5px 0 rgba(0, 0, 0, 0.12);
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

export default StyledSwaggerUI;
