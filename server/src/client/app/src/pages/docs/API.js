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
`;

function OpenMLSwaggerUI() {
  return (
    <StyledSwaggerUI>
      <SwaggerUI url="swagger.json" />
    </StyledSwaggerUI>
  );
}

export default OpenMLSwaggerUI;
