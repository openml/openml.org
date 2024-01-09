import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";
import { getItem } from "../api/getItem";

import styled from "@emotion/styled";
import { Avatar, Card, CardContent, Chip, Grid, IconButton, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { faClock, faCloudDownloadAlt, faCode, faDatabase, faFileAlt, faTags } from "@fortawesome/free-solid-svg-icons";

import { MetaTag } from "../../components/MetaItems"
import ReactMarkdown from "react-markdown";


import { CollapsibleDataTable } from "../api/sizeLimiter";
import { FeatureDetail, QualityDetail, updateTag, TagChip } from "../api/itemDetail";
export async function getStaticPaths() {
  // No paths are pre-rendered
  return { paths: [], fallback: "blocking" }; // or fallback: true, if you prefer
}

const ActionButton = styled(IconButton)`
  float: right;
  border-radius: 0;
`;

const Action = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const UserChip = styled(Chip)`
  margin-bottom: 5px;
`;



const CroissantComponent = ({ url }) => {
  const [jsonData, setJsonData] = useState({});

  useEffect(() => {
    const fetchJsonData = async () => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setJsonData(data);
        } else {
          // Handle HTTP errors
          setJsonData({
            error: true,
            status: response.status,
            message: `HTTP error: ${response.status}`,
          });
        }
      } catch (error) {
        // Handle fetch errors
        setJsonData({
          error: true,
          message: error.message || "Error fetching JSON.",
        });
      }
    };

    fetchJsonData();
  }, [url]);
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonData)}</script>
    </Helmet>
  );
};

export async function getStaticProps({ params, locale }) {
  // Fetch necessary data for the dataset page using params.dataId
  const data = await getItem("data", params.dataId);

  return {
    props: {
      data,
      // pass the translation props to the page component
      ...(await serverSideTranslations(locale)),
    },
  };
}

// export async function getStaticProps({params, locale}) {
//   // console.log(process.cwd() + '/app/data.json')
//   const file = await fs.readFile('C:/Users/nemeth/Downloads/data1.json');

//   // const data = JSON.parse(file);
//   // console.log(data);
//   const res = await fetch('https://es.openml.org/data/data/1')
//   const data = await res.json()
//   // console.log(repo)
//   return {props: {data : data, locale: await serverSideTranslations(locale)}}//, locale: await serverSideTranslations(locale)}}
// // ...(await serverSideTranslations(locale))}
// }

function Dataset({ data }) {
  const router = useRouter();
  const dataId = router.query.dataId;
  // console.log(data["data_id"]);
  const featureTableColumns = [
    "",
    "Feature Name",
    "Type",
    "Distinct/Missing Values"
  ];
  const qualityTableColumns = ["", "Quality Name", "Value"];
  const did = data.data_id;
  const did_padded = did.toString().padStart(4, "0");
  const bucket_url = "https://openml1.win.tue.nl/datasets/";
  const bucket_bracket = Math.floor(did / 10000)
    .toString()
    .padStart(4, "0");
  const croissant_url =
    bucket_url +
    bucket_bracket +
    "/" +
    did_padded +
    "/dataset_" +
    did +
    "_croissant.json";

  return (
    <React.Fragment>
      {/* Download buttons */}
      <CroissantComponent url={croissant_url} />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <React.Fragment>
            <Tooltip title="Download Croissant description" placement="bottom-start" suppressHydrationWarning>
              <ActionButton color="primary" href={croissant_url}>
                <Action>
                  <Icon icon="fluent-emoji-high-contrast:croissant" />
                  <Typography>Croissant</Typography>
                </Action>
              </ActionButton>
            </Tooltip>
            <Tooltip title="Download XML description" placement="bottom-start">
              <ActionButton color="primary" href={"https://www.openml.org/api/v1/data/" + data.data_id}>
                <Action>
                  <FontAwesomeIcon icon={faCode} />
                  <Typography>xml</Typography>
                </Action>
              </ActionButton>
            </Tooltip>
            <Tooltip title="Download JSON description" placement="bottom-start">
              <ActionButton color="primary" href={"https://www.openml.org/api/v1/json/data/" + data.data_id}>
                <Action>
                  <FontAwesomeIcon icon={faFileAlt} />
                  <Typography>json</Typography>
                </Action>
              </ActionButton>
            </Tooltip>
            <Tooltip title="Download dataset" placement="bottom-start">
              <ActionButton color="primary" href={data.url}>
                <Action>
                  <FontAwesomeIcon icon={faCloudDownloadAlt} />
                  <Typography>download</Typography>
                </Action>
              </ActionButton>
            </Tooltip>
            {/* <Tooltip title="Edit dataset (requires login)" placement="bottom-start">
              <ActionButton color={context.loggedIn ? "primary" : "default"} href={context.loggedIn ? "auth/data-edit?id=" + data.data_id : "auth/sign-in"}>
                <Action>
                  <FontAwesomeIcon icon="edit" />
                  <Typography>edit</Typography>
                </Action>
              </ActionButton>
            </Tooltip> */}
          </React.Fragment>
            {/* Metadata */}
          <Grid container>
            <Grid item md={12}>
              <Typography variant="h1" style={{ marginBottom: "15px" }}>
                <FontAwesomeIcon icon={faDatabase} />
                &nbsp;&nbsp;&nbsp;{data.name}
              </Typography>
            </Grid>
            <Grid item md={12}>
              <Grid container display="flex" spacing={2}>
                <Grid item><MetaTag type={"id"} value={"ID: " + data.data_id} /></Grid>
                <Grid item><MetaTag type={"status"} value={data.status === 'active' ? 'verified' : data.status}
                  color={data.status === 'active' ? 'green' : (data.status === 'deactivated' ? 'red' : 'orange')} /></Grid>
                <Grid item><MetaTag type={"format"} value={data.format} /></Grid>
                <Grid item><MetaTag type={"licence"} value={data.licence} /></Grid>
                <Grid item><FontAwesomeIcon icon={faClock} />{" "}
                  {data.date.split(" ")[0]}</Grid>
                <Grid item><MetaTag type={"version"} value={'v.' + data.version} /></Grid>
                <Grid item style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                  <UserChip
                    size="small"
                    color="primary"
                    label="Version history"
                    avatar={
                      <Avatar><FontAwesomeIcon icon={faClock} /></Avatar>
                    }
                    href={"search?type=data&sort=version&status=any&order=asc&exact_name=" + data.name}
                    component="a"
                    clickable
                  /></Grid>
              </Grid>

              <Grid container display="flex" spacing={2}>
                <Grid item><UserChip
                  size="small"
                  variant="outlined"
                  color="primary"
                  avatar={
                    <Avatar>{data.uploader ? data.uploader.charAt(0) : "X"}</Avatar>
                  }
                  label={data.uploader}
                  href={"search?type=user&id=" + data.uploader_id}
                  component="a"
                  clickable
                /></Grid>
                <Grid item><MetaTag type={"likes"} value={data.nr_of_likes + " likes"} /></Grid>
                <Grid item><MetaTag
                  type={"issues"}
                  value={data.nr_of_issues + " issues"}
                /></Grid>
                <Grid item><MetaTag
                  type={"downloads"}
                  value={data.nr_of_downloads}
                /></Grid>
              </Grid>

            </Grid>


          </Grid>
            
            {/* Tags */}
          <Grid container>
              <Grid item md={12}>
                <FontAwesomeIcon icon={faTags} /> {data.tags.map(element => element.tag.toString().startsWith("study") ? "" :
                <TagChip key={"tag_" + element.tag} label={"  " + element.tag + "  "} size="small" onClick={() => updateTag(element.tag)} />

                
          )}


              </Grid>
            </Grid>

        </Grid>
        {/* Description */}
        <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" mb={6}>
                  Description
                </Typography>
                <div className="contentSection">
                  <ReactMarkdown children={data.description} />
                </div>
              </CardContent>
            </Card>
          </Grid>

        {/* Features */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <CollapsibleDataTable
                  title={data.features.length + " Features"}
                  columns={featureTableColumns}
                  data={data.features}
                  rowrenderer={m => (
                    <FeatureDetail
                      key={"fd_" + m.name}
                      item={m}
                      type={m.type}
                    ></FeatureDetail>
                  )}
                  maxLength={7}
                />
              </CardContent>
            </Card>
          </Grid>
          
          {/* Qualities */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <CollapsibleDataTable
                  title={
                    Object.keys(data.qualities).length +
                    " Qualities"
                  }
                  data={Object.keys(data.qualities)}
                  rowrenderer={m => (
                    <QualityDetail
                      key={"q_" + m}
                      item={{ name: m, value: data.qualities[m] }}
                    />
                  )}
                  columns={qualityTableColumns}
                  maxLength={7}
                />
              </CardContent>
            </Card>
          </Grid>
      </Grid>




    </React.Fragment>
  );
}

Dataset.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dataset;
