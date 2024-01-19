import { useRouter } from "next/router";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Typography } from "@mui/material";
import DashboardLayout from "../../layouts/Dashboard";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getItem } from "../api/getItem";
import { shortenName } from "../../components/search/flowCard";
import { LightTooltip, TagChip } from "../api/itemDetail";

import { Card, CardContent, Grid } from "@mui/material";
import { MetaTag } from "../../components/MetaItems";
import ReactMarkdown from "react-markdown";
import { CollapsibleDataTable, StringLimiter } from "../api/sizeLimiter";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faTags } from "@fortawesome/free-solid-svg-icons";
import Wrapper from "../../components/Wrapper";
import DependencyTable from "../../components/flow/DependencyTable";
import ParameterTable from "../../components/flow/ParameterTable";

export async function getStaticPaths() {
  // No paths are pre-rendered
  return { paths: [], fallback: "blocking" }; // or fallback: true, if you prefer
}

export async function getStaticProps({ params, locale }) {
  // Fetch necessary data for the flow page using params.flowId
  const data = await getItem("flow", params.flowId);

  return {
    props: {
      data,
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

function prettyPrint(str) {
  let result = "";
  let indentLevel = 0;
  const indentSize = 2; // Number of spaces for each indentation level

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === "(") {
      indentLevel++;
      result += char + "\n" + " ".repeat(indentLevel * indentSize);
    } else if (char === ")") {
      indentLevel--;
      result += "\n" + " ".repeat(indentLevel * indentSize) + char;
    } else if (char === ",") {
      result += char + "\n" + " ".repeat(indentLevel * indentSize);
    } else {
      result += char;
    }
  }

  return result;
}

function Flow({ data }) {
  return (
    <Wrapper>
      <Helmet title="OpenML Flows" />

      <React.Fragment>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Grid container style={{ padding: "25px 0" }}>
              <Grid item md={12}>
                <LightTooltip title={data.name}>
                  <Typography
                    variant={"h1"}
                    style={{ marginBottom: "15px", wordWrap: "break-word" }}
                  >
                    <FontAwesomeIcon icon={faCogs} />
                    &nbsp;&nbsp;&nbsp;
                    <StringLimiter
                      maxLength={65}
                      value={shortenName(data.name)}
                    />
                  </Typography>
                </LightTooltip>
              </Grid>
              <Grid item md={12}>
                <MetaTag type={"status"} value={data.visibility} />
                <MetaTag
                  type={"uploaded"}
                  date={data.date}
                  uploader={data.uploader}
                />
                <br />
                <MetaTag type={"likes"} value={data.nr_of_likes} />
                <MetaTag type={"issues"} value={data.nr_of_issues} />
                <MetaTag type={"downvotes"} value={data.nr_of_downvotes} />
                <MetaTag type={"downloads"} value={data.nr_of_downloads} />
                <MetaTag type={"runs"} value={data.runs} />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item md={12}>
                <FontAwesomeIcon icon={faTags} />{" "}
                {data.tags.map((element) =>
                  element.tag.toString().startsWith("study") ? (
                    ""
                  ) : (
                    <TagChip
                      key={"tag_" + element.tag}
                      label={"  " + element.tag + "  "}
                      size="small"
                      onClick={() => updateTag(element.tag)}
                    />
                  ),
                )}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant={"h4"}>Description</Typography>
                <ReactMarkdown>{data.description}</ReactMarkdown>
                <pre>{prettyPrint(data.name)}</pre>
              </CardContent>
            </Card>
          </Grid>

          {/* Dependency and Parameter tables */}
          <Grid item xs={12}>
            <DependencyTable data={data.dependencies} />
          </Grid>
          <Grid item xs={12}>
            <ParameterTable data={data.parameters} />
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant={"h4"}>Runs ({data.runs})</Typography>
                <br />
                Run visualization not currently supported
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* <Helmet title="OpenML Flows" />
      <Typography variant="h3" gutterBottom>
        Flow {flowId}
      </Typography>
      <Typography variant="p" gutterBottom>
        {data.name}
      </Typography>
      <Typography variant="h5" gutterBottom>
        {shortenName(data.name)}
      </Typography> */}
      </React.Fragment>
    </Wrapper>
  );
}

Flow.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Flow;
