import React, { useState } from "react";

import { makeStyles } from "@material-ui/core/styles";

import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import LinearProgress from "@material-ui/core/LinearProgress";

import SaveAltIcon from "@material-ui/icons/SaveAlt";

import Logo from "../assets/logo.png";
import Background from "../assets/login-background.jpg";

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

const useStyles = makeStyles((theme) => ({
  registerFieldTF: {
    marginTop: theme.spacing(2),
  },
}));

function validateEmailFormat(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function SignUp(props) {
  const classes = useStyles();

  const [fullname, setFullname] = useState();
  const [email, setEmail] = useState();
  const [address, setAddress] = useState();
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState();
  const [snackbarText, setSnackbarText] = useState();

  const [redirect, setRedirect] = useState();

  const handleFullnameChange = (event) => {
    setFullname(event.target.value);
  };

  const handleEmailChange = (event) => {
    if (!validateEmailFormat(event.target.value)) setEmailError(true);
    else setEmailError(false);
    setEmail(event.target.value);
  };

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value);
  };

  const handleSignUp = (event) => {
    event.preventDefault();

    if (!fullname || !email || !address || !password || !passwordConfirm) {
      handleSnackbarOpen("Please fill all the required fields!", "warning");
      return;
    }

    if (!validateEmailFormat(email)) {
      handleSnackbarOpen("The filled email format is incorrect!", "warning");
      return;
    }

    if (password !== passwordConfirm) {
      handleSnackbarOpen(
        "The password must has the same value with the confirmation field!",
        "warning"
      );
      return;
    }

    setLoading(true);
    Axios.put("/user", {
      fullname,
      email,
      address,
      password,
    })
      .then(() => {
        handleSnackbarOpen(
          "Your account has been registered! you will be redirected to the login page...",
          "success"
        );
        setTimeout(() => {
          setRedirect("/login");
        }, 2000);
      })
      .catch((error) => {
        console.error(error.response.data.messasge);
        if (error.response.status === 401)
          handleSnackbarOpen(
            "The email you were filled in has been registered in the system.",
            "error"
          );
        else
          handleSnackbarOpen(
            "Failed to register your account, there was a server problem.",
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
                      <Typography
                        variant="subtitle1"
                        style={{ textAlign: "center" }}
                      >
                        Please fill the required fields to sign up
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        label="Full Name"
                        onChange={handleFullnameChange}
                        disabled={loading}
                        fullWidth
                      />
                      <TextField
                        variant="outlined"
                        label="Address"
                        onChange={handleAddressChange}
                        disabled={loading}
                        className={classes.registerFieldTF}
                        fullWidth
                      />
                      <TextField
                        variant="outlined"
                        label="Email"
                        onChange={handleEmailChange}
                        disabled={loading}
                        error={emailError}
                        className={classes.registerFieldTF}
                        fullWidth
                      />
                      <TextField
                        type="password"
                        variant="outlined"
                        label="Password"
                        disabled={loading}
                        onChange={handlePasswordChange}
                        className={classes.registerFieldTF}
                        fullWidth
                      />
                      <TextField
                        type="password"
                        variant="outlined"
                        label="Password Confirm"
                        disabled={loading}
                        onChange={handlePasswordConfirmChange}
                        className={classes.registerFieldTF}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2">
                        Already have an account?{" "}
                        <Link component={RouterLink} to="/login">
                          click here
                        </Link>{" "}
                        to go to the login page.
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
                          endIcon={<SaveAltIcon />}
                          disabled={loading}
                          onClick={handleSignUp}
                        >
                          Sign Up
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
