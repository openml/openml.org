import React from "react";
import styled from "@emotion/styled";
import Link from "next/link";

import { Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HeroTitle = styled(Typography)`
  text-align: center;
  line-height: 150%;
  padding-top: 2em;
  padding-bottom: 1em;
  scroll-margin-top: 2.5em;
`;

const HeroSubTitle = styled(Typography)`
  text-align: center;
  line-height: 150%;
  font-size: 1.1rem;
  padding-top: 0.5vw;
`;

const Header = ({ id, title, icon, color }) => {
  return (
    <HeroTitle variant="h3" align="center" id={id}>
      <HeroSubTitle>
        <Link href={`#${id}`}>
          <FontAwesomeIcon
            icon={icon}
            size="2x"
            style={{ color: color, paddingBottom: 10 }}
          />
        </Link>
        <br />
        {title}
      </HeroSubTitle>
    </HeroTitle>
  );
};

export default Header;
