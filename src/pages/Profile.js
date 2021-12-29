import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import MiniDrawer from "../components/Drawer";
import Loading from "../components/Loading";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";

import SaveIcon from "@material-ui/icons/Save";
import LoopIcon from "@material-ui/icons/Loop";
import SaveAltIcon from "@material-ui/icons/SaveAlt";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import { useCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import Axios from "axios";

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
  paperPadding: {
    padding: theme.spacing(2),
  },
  cardTitle: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: theme.spacing(2),
    fontSize: 18,
  },
  changePasswordCard: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  userProfileFormControl: {
    width: "100%",
  },
  textFieldMargin: {
    marginBottom: theme.spacing(2),
  },
  buttonAlignRight: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
}));

function validateEmailFormat(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function ProfilePage(props) {
  const classes = useStyles();

  const [cookies, setCookies, removeCookies] = useCookies();

  const [fullname, setFullname] = useState();
  const [email, setEmail] = useState();
  const [address, setAddress] = useState();
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [deviceToken, setDeviceToken] = useState();

  const [emailError, setEmailError] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState();
  const [snackbarText, setSnackbarText] = useState();

  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState();

  useEffect(() => {
    Axios.get("/user", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    })
      .then((response) => {
        setFullname(response.data.fullname);
        setEmail(response.data.email);
        setAddress(response.data.address);
        setDeviceToken(response.data.device_token);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.response.data.message);
        // if (error.response.status === 401) setRedirect("/login");
      });
  }, []);

  const handleChangePassword = (event) => {
    event.preventDefault();

    if (!newPassword || !passwordConfirm) {
      handleSnackbarOpen("Please fill all the required fields!", "warning");
      return;
    }

    if (newPassword !== passwordConfirm) {
      handleSnackbarOpen(
        "The password must has the same value with the confirmation field!",
        "warning"
      );
      return;
    }

    Axios.patch(
      "/user/password",
      {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirm: passwordConfirm,
      },
      {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      }
    )
      .then((response) => {
        handleSnackbarOpen(
          "The password has been successfully saved. Please re-login to continue...",
          "success"
        );
        removeCookies("access_token");
        setTimeout(() => {
          setRedirect("/login");
        }, 2000);
      })
      .catch((error) => {
        console.error(error.response.data.messasge);
        handleSnackbarOpen("Failed to update your password.", "error");
      });
  };

  const handleProfileUpdate = (event) => {
    event.preventDefault();

    if (!fullname || !email || !address) {
      handleSnackbarOpen("Please fill all the required fields!", "warning");
      return;
    }

    if (!validateEmailFormat(email)) {
      handleSnackbarOpen("The filled email format is incorrect!", "warning");
      return;
    }

    Axios.patch(
      "/user",
      {
        fullname,
        email,
        address,
      },
      {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      }
    )
      .then(() => {
        handleSnackbarOpen(
          "Your profile has been successfully saved.",
          "success"
        );
      })
      .catch((error) => {
        console.error(error.response.data.message);
        if (error.response.status == 409)
          handleSnackbarOpen(
            "The filled email is already registered in the system.",
            "error"
          );
        else handleSnackbarOpen("Failed to update your profile.", "error");
      });
  };

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

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handlePasswordConfirmChange = (event) => {
    setPasswordConfirm(event.target.value);
  };

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
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

  if (loading)
    return (
      <MiniDrawer title="Dashboard">
        <Loading />
      </MiniDrawer>
    );

  return (
    <React.Fragment>
      <MiniDrawer title="Profile">
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            <Paper className={classes.paperPadding}>
              <Typography variant="subtitle1" className={classes.cardTitle}>
                User Profile
              </Typography>
              <form className={classes.userProfileFormControl}>
                <TextField
                  variant="outlined"
                  label="Full Name"
                  value={fullname}
                  onChange={handleFullnameChange}
                  fullWidth
                  className={classes.textFieldMargin}
                />
                <TextField
                  variant="outlined"
                  label="Email"
                  value={email}
                  error={emailError}
                  onChange={handleEmailChange}
                  fullWidth
                  className={classes.textFieldMargin}
                />
                <TextField
                  variant="outlined"
                  label="Address"
                  value={address}
                  onChange={handleAddressChange}
                  fullWidth
                  className={classes.textFieldMargin}
                />
                <div className={classes.buttonAlignRight}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={<SaveIcon />}
                    onClick={handleProfileUpdate}
                  >
                    Save Profile
                  </Button>
                </div>
              </form>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.paperPadding}>
              <Typography variant="subtitle1" className={classes.cardTitle}>
                Device Token
              </Typography>
              <TextField
                variant="outlined"
                label="Token"
                fullWidth
                className={classes.textFieldMargin}
                value={deviceToken}
                InputProps={{
                  readOnly: true,
                }}
              />
              <div className={classes.buttonAlignRight}>
                <Button
                  variant="contained"
                  color="primary"
                  endIcon={<LoopIcon />}
                >
                  Randomize Token
                </Button>
              </div>
            </Paper>
            <Paper className={classes.changePasswordCard}>
              <Typography variant="subtitle1" className={classes.cardTitle}>
                Change Password
              </Typography>
              <form>
                <TextField
                  type="password"
                  variant="outlined"
                  label="Old Password"
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                  fullWidth
                  className={classes.textFieldMargin}
                />
                <TextField
                  type="password"
                  variant="outlined"
                  label="New Password"
                  value={newPassword}
                  onChange={handleNewPasswordChange}
                  fullWidth
                  className={classes.textFieldMargin}
                />
                <TextField
                  type="password"
                  variant="outlined"
                  label="Confirmation Field"
                  value={passwordConfirm}
                  onChange={handlePasswordConfirmChange}
                  fullWidth
                  className={classes.textFieldMargin}
                />
                <div className={classes.buttonAlignRight}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    endIcon={<SaveAltIcon />}
                    onClick={handleChangePassword}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </MiniDrawer>

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
