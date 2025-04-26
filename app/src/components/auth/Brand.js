import { styled } from "@mui/material/styles";

const BrandImage = styled("img")(({ theme }) => ({
  width: 64,
  height: 64,
  marginBottom: 32,
  fill: theme.palette.primary.main, // note: fill might not work for img
}));

export default function Brand() {
  return <BrandImage src="/static/svg/logo.svg" alt="Logo" />;
}
