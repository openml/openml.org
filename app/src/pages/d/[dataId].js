import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { Typography } from "@mui/material";

import DashboardLayout from "../../layouts/Dashboard";
import { getItem } from "../api/getItem";

import styled from "@emotion/styled";
import { Grid, IconButton, Tooltip } from "@mui/material";
import { Icon } from "@iconify/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Server-side translation
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { faCloudDownloadAlt } from "@fortawesome/free-solid-svg-icons";

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
  console.log(data["data_id"]);

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
      <CroissantComponent url={croissant_url} />
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <React.Fragment>
            {/* <Tooltip title="Download Croissant description" placement="bottom-start" suppressHydrationWarning>
              <ActionButton color="primary" href={croissant_url}>
                <Action>
                  <Icon icon="fluent-emoji-high-contrast:croissant" />
                  <Typography>Croissant</Typography>
                </Action>
              </ActionButton>
            </Tooltip> */}
            {/* <Tooltip title="Download XML description" placement="bottom-start">
              <ActionButton color="primary" href={"https://www.openml.org/api/v1/data/" + data.data_id}>
                <Action>
                  <FontAwesomeIcon icon="file-code" />
                  <Typography>xml</Typography>
                </Action>
              </ActionButton>
            </Tooltip> */}
            {/* <Tooltip title="Download JSON description" placement="bottom-start">
              <ActionButton color="primary" href={"https://www.openml.org/api/v1/json/data/" + data.data_id}>
                <Action>
                  <FontAwesomeIcon icon="file-alt" />
                  <Typography>json</Typography>
                </Action>
              </ActionButton>
            </Tooltip> */}
            <Tooltip title="Download dataset" placement="bottom-start">
              <ActionButton color="primary" href={data.url}>
                <Action>
                  <FontAwesomeIcon icon={faCloudDownloadAlt} />
                  {/* <Typography>download</Typography> */}
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
        </Grid>
      </Grid>
      <Helmet title="OpenML Datasets" />
      <Typography variant="h3" gutterBottom>
        Dataset {dataId}
      </Typography>
    </React.Fragment>
  );
}

Dataset.getLayout = function getLayout(page) {
  return <DashboardLayout>{page}</DashboardLayout>;
};

export default Dataset;
