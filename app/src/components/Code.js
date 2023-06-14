import React from "react";
import styled from "@emotion/styled";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/cjs/styles/hljs";

const Base = styled(SyntaxHighlighter)`
  border-radius: 3px;
  padding: ${(props) => props.theme.spacing(3)} !important;
  background-color: #1b2430 !important;
`;

const Code = ({ children }) => {
  return (
    <Base language="javascript" style={vs2015}>
      {children}
    </Base>
  );
};

export default Code;
