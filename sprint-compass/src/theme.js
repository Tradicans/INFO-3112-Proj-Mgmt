import { createTheme } from "@mui/material/styles";
export default createTheme({
 typography: {
 useNextVariants: true,
 },

"palette":{
    "common":{"black":"#000","white":"#fff"},
    "background":{"paper":"#fff","default":"#fafafa"},
    "primary":{"light":"rgba(62, 188, 230, 1)","main":"rgba(24, 147, 187, 1)","dark":"rgba(8, 107, 139, 1)","contrastText":"#fff"},
    "secondary":{"light":"rgba(178, 112, 244, 1)","main":"rgba(133, 38, 230, 1)","dark":"rgba(109, 13, 206, 1)","contrastText":"#fff"},
    "error":{"light":"rgba(240, 70, 224, 1)","main":"rgba(218, 16, 199, 1)","dark":"rgba(173, 6, 158, 1)","contrastText":"#fff"},
    "text":{"primary":"rgba(0, 0, 0, 0.87)","secondary":"rgba(0, 0, 0, 0.54)","disabled":"rgba(0, 0, 0, 0.38)","hint":"rgba(0, 0, 0, 0.38)"}}
});