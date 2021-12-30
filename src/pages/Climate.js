import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import MiniDrawer from "../components/Drawer";
import Loading from "../components/Loading";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";
import InputAdornment from "@material-ui/core/InputAdornment";
import Switch from "@material-ui/core/Switch";

import SaveAltIcon from "@material-ui/icons/SaveAlt";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";

import { useCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import Axios from "axios";

const useStyles = makeStyles((theme) => ({
  defaultPaper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  parameterCaption: {
    fontWeight: "bold",
  },
  buttonAlignRight: {
    marginTop: theme.spacing(2),
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
  },
  deviceConfigTextField: {
    marginTop: theme.spacing(1),
  },
  controlContent: {
    marginBottom: theme.spacing(1),
  },
  timePicker: {
    marginRight: theme.spacing(2),
  },
  featureToggle: {
    marginLeft: theme.spacing(-2),
  },
}));

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

export default function ClimatePage(props) {
  const classes = useStyles();

  const [cookies, setCookies, removeCookies] = useCookies();

  const [pH, setPh] = useState(0);
  const [TDS, setTDS] = useState(0);
  const [EC, setEC] = useState(0);
  const [lightIntensity, setLightIntensity] = useState(0);
  const [nutrientFlow, setNutrientFlow] = useState(0);

  const [selectedDate, setSelectedDate] = useState(
    new Date("2014-08-18T21:11:54")
  );

  const [featureToggles, setFeatureToggles] = useState({
    phToggle: true,
    tdsToggle: true,
    ecToggle: true,
    lightIntensityToggle: true,
    nutrientFlowToggle: true,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState();
  const [snackbarText, setSnackbarText] = useState();

  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState();

  useEffect(() => {
    Axios.get("/agroclimate", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    })
      .then((response) => {
        setPh(response.data.ph);
        setTDS(response.data.tds);
        setEC(response.data.ec);
        setLightIntensity(response.data.light_intensity);
        setNutrientFlow(response.data.nutrient_flow);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.response);
        if (error.response.status === 401) setRedirect("/login");
      });
  }, [cookies.access_token]);

  const handlePhChange = (e, newValue) => {
    setPh(newValue);
  };

  const handleTDSChange = (e, newValue) => {
    setTDS(newValue);
  };

  const handleECChange = (e, newValue) => {
    setEC(newValue);
  };

  const handleLightIntensityChange = (e, newValue) => {
    setLightIntensity(newValue);
  };

  const handleNutrientFlowChange = (e, newValue) => {
    setNutrientFlow(newValue);
  };

  const handleFeatureToggles = (e) => {
    // console.log({ [e.target.name]: e.target.checked });
    setFeatureToggles({
      ...featureToggles,
      [e.target.name]: e.target.checked,
    });
  };

  const handleAgroclimateConfigSave = () => {
    handleSnackbarOpen(
      "The agroclimate configuration has been saved!",
      "success"
    );
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
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
      <MiniDrawer title="Settings">
        <Loading />
      </MiniDrawer>
    );

  return (
    <>
      <MiniDrawer title="Settings">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.defaultPaper}>
              <Typography variant="h5">
                Climate Control Configuration
              </Typography>
              <Typography variant="subtitle2">
                You can change the desired fields below and then click the blue
                button to save the new climate control configuration.
              </Typography>
              <Grid container spacing={2} className={classes.controlContent}>
                {/* pH */}
                <Grid item xs={12} sm={8}>
                  <Typography
                    variant="subtitle1"
                    className={classes.parameterCaption}
                  >
                    <Switch
                      className={classes.featureToggle}
                      checked={featureToggles.phToggle}
                      color="primary"
                      onChange={handleFeatureToggles}
                      name="phToggle"
                    />
                    pH
                  </Typography>

                  <Slider
                    value={pH}
                    onChange={handlePhChange}
                    defaultValue={0}
                    step={0.1}
                    min={1}
                    max={12}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={pH}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                {/* TDS */}
                <Grid item xs={12} sm={8}>
                  <Typography
                    variant="subtitle1"
                    className={classes.parameterCaption}
                  >
                    <Switch
                      className={classes.featureToggle}
                      checked={featureToggles.tdsToggle}
                      color="primary"
                      onChange={handleFeatureToggles}
                      name="tdsToggle"
                    />
                    TDS
                  </Typography>
                  <Slider
                    value={TDS}
                    onChange={handleTDSChange}
                    defaultValue={0}
                    step={1}
                    min={0}
                    max={2000}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={TDS}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">ppm</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {/* Electrical conductivity */}
                <Grid item xs={12} sm={8}>
                  <Typography
                    variant="subtitle1"
                    className={classes.parameterCaption}
                  >
                    <Switch
                      className={classes.featureToggle}
                      checked={featureToggles.ecToggle}
                      color="primary"
                      onChange={handleFeatureToggles}
                      name="ecToggle"
                    />
                    Electrical Conductivity
                  </Typography>
                  <Slider
                    value={EC}
                    onChange={handleECChange}
                    defaultValue={0}
                    step={0.1}
                    min={0}
                    max={10}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={EC}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">mS/cm</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                {/* Light intensity */}
                <Grid item xs={12} sm={8}>
                  <Typography
                    variant="subtitle1"
                    className={classes.parameterCaption}
                  >
                    <Switch
                      className={classes.featureToggle}
                      checked={featureToggles.lightIntensityToggle}
                      color="primary"
                      onChange={handleFeatureToggles}
                      name="lightIntensityToggle"
                    />
                    Light Intensity
                  </Typography>
                  <Slider
                    value={lightIntensity}
                    onChange={handleLightIntensityChange}
                    defaultValue={0}
                    step={1}
                    min={0}
                    max={40000}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={lightIntensity}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">lux</InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </Grid>
                {/* Nutrient flow */}
                <Grid item xs={12} sm={8}>
                  <Typography
                    variant="subtitle1"
                    className={classes.parameterCaption}
                  >
                    <Switch
                      className={classes.featureToggle}
                      checked={featureToggles.nutrientFlowToggle}
                      color="primary"
                      onChange={handleFeatureToggles}
                      name="nutrientFlowToggle"
                    />
                    Nutrient Flow
                  </Typography>
                  <Slider
                    value={nutrientFlow}
                    onChange={handleNutrientFlowChange}
                    defaultValue={0}
                    step={0.1}
                    min={0}
                    max={10}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={nutrientFlow}
                    variant="outlined"
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          &#8467;/m
                        </InputAdornment>
                      ),
                    }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper className={classes.defaultPaper}>
              <Typography variant="h5">Device Configuration</Typography>
              <Typography variant="subtitle2">
                You can change the desired fields below and then click the blue
                button to save the new climate control configuration.
              </Typography>
              <div className={classes.controlContent}>
                <TextField
                  label="Regather Configuration Interval"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">s</InputAdornment>
                    ),
                  }}
                  value={12}
                  type="number"
                  variant="filled"
                  fullWidth
                  className={classes.deviceConfigTextField}
                />
                <TextField
                  label="Agroclimate Parameters Logging Interval"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">s</InputAdornment>
                    ),
                  }}
                  value={12}
                  type="number"
                  variant="filled"
                  fullWidth
                  className={classes.deviceConfigTextField}
                />
              </div>
            </Paper>
            <Paper className={classes.defaultPaper}>
              <Typography variant="h5">Daylight Configuration</Typography>
              <Typography variant="subtitle2">
                You can change the desired fields below and then click the blue
                button to save the new climate control configuration.
              </Typography>
              <div className={classes.controlContent}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <TimePicker
                    margin="dense"
                    variant="inline"
                    label="Day start time"
                    format="HH:mm:ss"
                    views={["hours", "minutes", "seconds"]}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className={classes.timePicker}
                  />
                  <TimePicker
                    margin="dense"
                    variant="inline"
                    label="Day end time"
                    format="HH:mm:ss"
                    views={["hours", "minutes", "seconds"]}
                    value={selectedDate}
                    onChange={handleDateChange}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </Paper>
          </Grid>
        </Grid>
        <div className={classes.buttonAlignRight}>
          <Button
            variant="contained"
            color="primary"
            endIcon={<SaveAltIcon />}
            onClick={handleAgroclimateConfigSave}
          >
            Save
          </Button>
        </div>
      </MiniDrawer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={snackbarSeverity}>{snackbarText}</Alert>
      </Snackbar>
    </>
  );
}
