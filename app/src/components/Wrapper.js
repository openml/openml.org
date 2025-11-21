import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const WrapBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
  box-sizing: border-box;
`;

const Wrapper = ({ children, fullWidth }) => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <WrapBox py={fullWidth ? 0 : isLgUp ? 12 : isSmUp ? 10 : 5}>
      {children}
    </WrapBox>
  );
};

export default Wrapper;
