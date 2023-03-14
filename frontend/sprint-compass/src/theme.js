import { createTheme } from "@mui/material/styles";
export default createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    common: { black: "#000", white: "#fff" },
    background: {
      paper: "rgba(226, 226, 226, 1)",
      default: "rgba(234, 234, 234, 1)",
    },
    primary: {
      light: "rgba(188, 187, 240, 1)",
      main: "rgba(103, 101, 200, 1)",
      dark: "rgba(45, 43, 163, 1)",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(255, 206, 189, 1)",
      main: "rgba(255, 147, 107, 1)",
      dark: "rgba(233, 86, 31, 1)",
      contrastText: "#fff",
    },
    error: {
      light: "rgba(254, 162, 166, 1)",
      main: "rgba(252, 78, 87, 1)",
      dark: "rgba(239, 0, 12, 1)",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});
