import { styled } from "@mui/material/styles";

const StyledSwaggerUI = styled("div")(({ theme }) => ({
  // Hide certain model IDs
  "& [id^='model-'][id*='_']": { display: "none" },
  "& [id^='model-'][id*='List']": { display: "none" },
  "& [id^='model-'][id*='Unprocessed']": { display: "none" },
  "& [id^='model-'][id*='Request']": { display: "none" },
  "& [id^='model-'][id*='Trace']": { display: "none" },

  // Main Swagger UI text
  "& .swagger-ui, & .swagger-ui *, & .swagger-ui .info .title, & .swagger-ui .info p, & .swagger-ui .info li, & .swagger-ui select, & .swagger-ui .opblock *, & .swagger-ui .opblock .opblock-section-header *":
    {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default,
    },

  "& .swagger-ui .info a": {
    color: theme.palette.text.secondary,
  },

  "& .swagger-ui select, & .swagger-ui .opblock, & .swagger-ui .opblock-tag, & .swagger-ui section.models .model-container, & .swagger-ui .opblock .opblock-section-header":
    {
      backgroundColor: theme.palette.background.paper,
    },

  "& .swagger-ui .info .title small pre": {
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    fontFamily: theme.typography.fontFamily,
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    overflow: "auto",
    fontSize: "0.85rem",
  },

  "& .swagger-ui .model, & .swagger-ui table.model tr.property-row td": {
    fontSize: "10pt",
  },

  "& .swagger-ui .model-title": {
    fontSize: "12pt",
  },

  "& .swagger-ui .model-toggle:after": {
    background: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath fill='${encodeURIComponent(
      theme.name === "DARK" ? theme.palette.primary.contrastText : "#000",
    )}' d='M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z'/%3E%3C/svg%3E") 50% no-repeat`,
  },

  "& .swagger-ui .expand-methods svg, & .swagger-ui .opblock svg, & .swagger-ui .expand-operation svg":
    {
      fill: theme.name === "DARK" ? theme.palette.primary.contrastText : "#000",
    },

  "& .swagger-ui .opblock .opblock-summary-description": {
    color: theme.name === "DARK" ? theme.palette.primary.contrastText : "#000",
  },

  "& .swagger-ui .opblock.opblock-get, & .swagger-ui .opblock.opblock-post, & .swagger-ui .opblock.opblock-delete":
    {
      background: "inherit",
    },

  "& .swagger-ui .microlight": {
    backgroundColor: theme.palette.background.paper,
  },

  "& .swagger-ui .scheme-container": {
    background: "inherit",
    boxShadow: "none",
    direction: "rtl",
    display: "flex",
    justifyContent: "flex-end",
    padding: 0,
  },

  "& .swagger-ui .wrapper:nth-of-type(2n):before": {
    content: '"Actions"',
    fontSize: "18pt",
    fontWeight: 600,
  },

  "& #operations-tag-data": {
    marginTop: "20px",
  },

  "& .swagger-ui section.schemes": {
    marginLeft: "auto",
  },

  "& .swagger-ui .servers": {
    width: "320px",
  },

  "& .swagger-ui .servers > label": {
    margin: 0,
  },

  "& .swagger-ui section.models .model-container": {
    margin: 0,
    borderBottom: "1px solid rgba(59, 65, 81, 0.3)",
    borderRadius: "0px",
    boxShadow:
      "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",
  },

  "& .swagger-ui section.models .model-container:last-of-type": {
    margin: 0,
  },

  "& .swagger-ui section.models.is-open": {
    padding: 0,
  },

  "& .swagger-ui section.models": {
    border: "none",
  },

  "& .swagger-ui section.models h4": {
    marginBottom: "10px",
    fontSize: "18pt",
    fontWeight: 600,
  },

  "& .swagger-ui section.models.is-open h4": {
    marginTop: "20px",
    marginBottom: "0px",
    borderBottom: "0px",
  },

  "& .swagger-ui .info": {
    marginBottom: 0,
  },

  "& .swagger-ui .servers > label select": {
    height: "40px",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },

  "& .swagger-ui input, & .swagger-ui textarea": {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderColor: theme.palette.divider,
  },

  "& .swagger-ui table.model tr.property-row td": {
    padding: "0.6em",
    fontSize: "12pt",
  },

  "& .swagger-ui td .model .pointer .model-title": {
    display: "none",
  },

  "& .swagger-ui .model-box": {
    paddingTop: "7px",
    paddingLeft: "5px",
    paddingBottom: "7px",
  },

  "& .swagger-ui .model, & .swagger-ui .model-title": {
    fontSize: "12pt",
    textTransform: "lowercase",
  },

  "& .swagger-ui .model-title__text": {
    paddingLeft: "10px",
  },

  "& .swagger-ui td .model-toggle": {
    fontSize: "20px",
    top: "2px",
    marginLeft: "0px",
  },

  "& .swagger-ui td .brace-open": {
    fontSize: "16px",
  },

  "& .swagger-ui .opblock-tag": {
    margin: "0px",
    boxShadow:
      "0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 1px 5px 0 rgba(0, 0, 0, 0.12)",
  },

  "& .no-margin": {
    display: "flex",
    flexDirection: "column",
  },

  "& .swagger-ui .opblock-tag-section h4": {
    paddingLeft: "20px",
    fontSize: "12pt",
    height: "50px",
  },

  "& .swagger-ui .opblock-get, & .swagger-ui .opblock-post, & .swagger-ui .opblock-delete":
    {
      paddingLeft: "5px",
      marginBottom: "1px",
    },

  "& .swagger-ui .opblock-post": { order: 2 },

  "& .swagger-ui .opblock-delete": { order: 3 },

  "& .swagger-ui .opblock-summary": {
    height: "50px",
  },
}));

export default StyledSwaggerUI;
