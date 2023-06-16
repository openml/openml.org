import styled from "@emotion/styled";
import { Box } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const WrapBox = styled(Box)`
  display: flex;
  justify-content: center;
  align: center;
  max-width: 1200px;
  margin: auto;
`;

const Wrapper = ({ children, fullWidth }) => {
  const theme = useTheme();
  const isLgUp = useMediaQuery(theme.breakpoints.up("lg"));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <WrapBox
      px={isLgUp ? 12 : isSmUp ? 10 : fullWidth ? 0 : 5}
      py={isLgUp ? 12 : isSmUp ? 10 : 5}
    >
      {children}
    </WrapBox>
  );
};

export default Wrapper;
