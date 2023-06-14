import { Global, css } from "@emotion/react";

const GlobalStyle = (props) => (
  <Global
    {...props}
    styles={css`
      html,
      body,
      #__next {
        height: 100%;
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
      }

      .MuiCardHeader-action .MuiIconButton-root {
        padding: 4px;
        width: 28px;
        height: 28px;
      }
    `}
  />
);

export default GlobalStyle;
