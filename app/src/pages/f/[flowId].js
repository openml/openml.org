import { useRouter } from "next/router";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Typography } from "@mui/material";
import DashboardLayout from "../../layouts/Dashboard";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getItem } from "../api/getItem";
import { shortenName } from "../../components/search/flowCard";
import {
  ParameterDetail,
  DependencyDetail,
  LightTooltip,
  TagChip,
} from "../api/itemDetail";

import { Card, CardContent, Grid } from "@mui/material";
import { MetaTag } from "../../components/MetaItems";
import ReactMarkdown from "react-markdown";
import { CollapsibleDataTable, StringLimiter } from "../api/sizeLimiter";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs, faTags } from "@fortawesome/free-solid-svg-icons";

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

function Flow({ data }) {
  const router = useRouter();
  const flowId = router.query.flowId;

  let dependenciesMap = data.dependencies.split(", ").map((x) => x.split("_"));
  let parameterCols = ["Name", "Description", "Type", "Default Value"];

  return (
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
                  <StringLimiter maxLength={65} value={data.name} />
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
              <Typography variant={"h4"}>
                Description of{" "}
                <span style={{ wordWrap: "break-word" }}>{data.name}</span>
              </Typography>
              <ReactMarkdown>{data.description}</ReactMarkdown>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <CollapsibleDataTable
                title={"Dependencies"}
                data={dependenciesMap}
                rowrenderer={(dep) => (
                  <DependencyDetail
                    key={dep[0]}
                    name={dep[0]}
                    version={dep[1]}
                  />
                )}
                maxLength={7}
                columns={["Library", "Version"]}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <CollapsibleDataTable
                title={"Parameters"}
                data={data.parameters}
                rowrenderer={(m) => (
                  <ParameterDetail key={"fd_" + m.name} item={m} />
                )}
                maxLength={7}
                columns={parameterCols}
              />
            </CardContent>
          </Card>
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
  );
}

Flow.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Flow;
