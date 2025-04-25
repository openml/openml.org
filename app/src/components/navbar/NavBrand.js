import React from "react";
import { styled, useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";

const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const LogoWrapper = styled("div")(({ theme }) => ({
  display: "block",
  marginRight: theme.spacing(2),
}));

const TextWrapper = styled("div")(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.h5.fontSize,
  fontFamily: theme.typography.fontFamily,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
}));

const SectionText = styled("span")(({ theme }) => ({
  marginLeft: theme.spacing(1),
  opacity: 0.8,
}));

const Brand = ({ ecolor, section }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!isMobile) {
    // ❌ On desktop and larger: show nothing
    return null;
  }

  return (
    <Wrapper>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <LogoWrapper>
          <Image
            src="/static/svg/logo.svg"
            alt="Logo"
            width={36}
            height={36}
            priority
          />
        </LogoWrapper>
      </motion.div>
      <TextWrapper>
        OpenML
        {section && <SectionText>|&nbsp;&nbsp;{section}</SectionText>}
      </TextWrapper>
    </Wrapper>
  );
};

export default Brand;
