import React from "react";
import { styled } from "@mui/material/styles";
import { useTranslation } from "next-i18next";

import { spacing } from "@mui/system";
import { Grid, Container, Typography } from "@mui/material";
import InfoCard from "../Card";

import { faCogs, faDatabase, faFlask } from "@fortawesome/free-solid-svg-icons";
import { purple, blue, red, yellow, green, orange } from "@mui/material/colors";

const Wrapper = styled("div")(spacing, {
  textAlign: "center",
});

// Maybe add chips as well to other parts of the landing page or docs
const ai_ready_data = {
  id: "landing.ai_ready_data",
  icon: faDatabase,
  iconColor: green[500],
  arrow: "right",
};
const integrations = {
  id: "landing.integrations",
  icon: faCogs,
  iconColor: blue[500],
  arrow: "right",
};
const ml_results = {
  id: "landing.ml_results",
  icon: faFlask,
  iconColor: red[500],
};

function Lifecycle() {
  const { t } = useTranslation();

  return (
    <Wrapper py={20}>
      <Container>
        <Typography variant="h2" component="h3" gutterBottom>
          {t("landing.lifecycle.header")}
        </Typography>
        <Typography
          variant="subtitle1"
          color="textSecondary"
          gutterBottom
          style={{ paddingBottom: 20 }}
        >
          {t("landing.lifecycle.sub_header")}
        </Typography>
        <Grid container spacing={6}>
          {[ai_ready_data, integrations, ml_results].map((card) => (
            <Grid
              display="flex"
              key={card.id}
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <InfoCard info={card} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Wrapper>
  );
}

export default Lifecycle;
