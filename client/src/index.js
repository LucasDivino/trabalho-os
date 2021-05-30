import React from "react";
import ReactDOM from "react-dom";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
import { AuthProvider } from "./context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Routes from "./routes";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#7e57c2",
      light: "#b085f5",
      dark: "#4d2c91",
    },
    secondary: {
      main: "#9fa8da",
      light: "#d1d9ff",
      dark: "#6f79a8",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ToastContainer />
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
