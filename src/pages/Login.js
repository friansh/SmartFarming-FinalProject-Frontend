import React, { useState } from "react";

import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import LinearProgress from "@material-ui/core/LinearProgress";

import InputIcon from "@material-ui/icons/Input";

import Logo from "../assets/logo.png";
import Background from "../assets/login-background.jpg";

import { useCookies } from "react-cookie";
import Axios from "axios";
import { Redirect, Link as RouterLink } from "react-router-dom";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return (
    <MuiAlert
      elevation={6}
      style={{ zIndex: 99 }}
      variant="filled"
      {...props}
    />
  );
}

export default function Login(props) {
  const [cookies, setCookie] = useCookies();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState();
  const [snackbarText, setSnackbarText] = useState();

  const [redirect, setRedirect] = useState();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    Axios.post("/user/login", {
      email,
      password,
    })
      .then((response) => {
        setCookie("access_token", response.data.token);
        handleSnackbarOpen(
          "Successfully logged in! you will be redirected to the dashboard page...",
          "success"
        );
        setTimeout(() => {
          setRedirect("/");
        }, 2000);
      })
      .catch((error) => {
        // console.error(error.response.data.messasge);
        handleSnackbarOpen(
          "Failed to log in, please re-check your email and password.",
          "error"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSnackbarOpen = (text, severity) => {
    setSnackbarText(text);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (redirect) return <Redirect to={redirect} />;

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundImage: `url('${Background}')`,
          backgroundSize: "cover",
          height: "100vh",
          overflow: "hidden",
          paddingLeft: 10,
          paddingRight: 10,
        }}
      >
        <div
          style={{
            zIndex: 1,
            height: "100%",
            width: "100%",
            position: "fixed",
            overflow: "hidden",
            top: "0px",
            left: "0px",
            background: "rgba(0, 0, 0, 0.6)",
          }}
        ></div>
        <div
          style={{
            zIndex: 2,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            alignItems: "center",
            marginTop: "-5%",
          }}
        >
          <img
            src={Logo}
            style={{ width: "25%", minWidth: 250, maxWidth: 500 }}
            alt="Smart Farmer Logo"
          />

          <Grid container style={{ justifyContent: "center" }}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper style={{ padding: 20, marginTop: 20 }}>
                <form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle1">
                        Please log in to continue...
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        label="Email"
                        onChange={handleEmailChange}
                        disabled={loading}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        type="password"
                        variant="outlined"
                        label="Password"
                        disabled={loading}
                        onChange={handlePasswordChange}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">
                        Do not have an account?{" "}
                        <Link component={RouterLink} to="/register">
                          click here
                        </Link>{" "}
                        to register a new one.
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "flex-end",
                        }}
                      >
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          endIcon={<InputIcon />}
                          disabled={loading}
                          onClick={handleLogin}
                        >
                          Login
                        </Button>
                      </div>
                    </Grid>
                  </Grid>
                </form>
                {loading ? (
                  <LinearProgress
                    style={{
                      marginTop: 20,
                      marginBottom: -20,
                      marginLeft: -18,
                      marginRight: -18,
                    }}
                  />
                ) : null}
              </Paper>
              <Typography
                style={{
                  width: "100%",
                  textAlign: "right",
                  fontSize: 12,
                  color: "grey",
                  marginTop: 20,
                }}
              >
                Copyright (C) 2021 Fikri Rida Pebriansyah
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbarSeverity}>{snackbarText}</Alert>
      </Snackbar>
    </React.Fragment>
  );
}
