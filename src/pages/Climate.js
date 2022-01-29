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
import Tooltip from "@material-ui/core/Tooltip";

import SaveAltIcon from "@material-ui/icons/SaveAlt";
import InfoIcon from "@material-ui/icons/Info";

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

  const [agroclimateSettings, setAgroclimateSettings] = useState({
    ph: 0,
    tdsMax: 0,
    tdsMin: 0,
    ecMax: 0,
    ecMin: 0,
    lightIntensity: 0,
    nutrientFlow: 0,
  });

  const [dayStart, setDayStart] = useState(new Date());
  const [dayEnd, setDayEnd] = useState(new Date());

  const [deviceSettings, setDeviceSettings] = useState({
    refreshTime: 0,
    loggingTime: 0,
  });

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

  const climateControlTooltipCaption =
    "The parameter on the dashboard page will be marked red if the value off from this threshold.";

  useEffect(() => {
    Axios.get("/agroclimate", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    })
      .then((response) => {
        setAgroclimateSettings({
          ph: response.data.ph,
          tdsMax: response.data.tds_max,
          tdsMin: response.data.tds_min,
          ecMax: response.data.ec_max,
          ecMin: response.data.ec_min,
          lightIntensity: response.data.light_intensity,
          nutrientFlow: response.data.nutrient_flow,
        });

        setDeviceSettings({
          refreshTime: response.data.refresh_time,
          loggingTime: response.data.logging_time,
        });
        setDayStart(new Date(response.data.day_start));
        setDayEnd(new Date(response.data.day_end));
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.response);
        if (error.response.status === 401) setRedirect("/login");
      });
  }, [cookies.access_token]);

  const handlePhChange = (e, newValue) => {
    setAgroclimateSettings({
      ...agroclimateSettings,
      ph: newValue,
    });
  };

  const handleTdsMaxChange = (e, newValue) => {
    setAgroclimateSettings({
      ...agroclimateSettings,
      tdsMax: newValue,
    });
  };

  const handleTdsMinChange = (e, newValue) => {
    setAgroclimateSettings({
      ...agroclimateSettings,
      tdsMin: newValue,
    });
  };

  const handleEcMaxChange = (e, newValue) => {
    setAgroclimateSettings({
      ...agroclimateSettings,
      ecMax: newValue,
    });
  };

  const handleEcMinChange = (e, newValue) => {
    setAgroclimateSettings({
      ...agroclimateSettings,
      ecMin: newValue,
    });
  };

  const handleLightIntensityChange = (e, newValue) => {
    setAgroclimateSettings({
      ...agroclimateSettings,
      lightIntensity: newValue,
    });
  };

  const handleNutrientFlowChange = (e, newValue) => {
    setAgroclimateSettings({
      ...agroclimateSettings,
      nutrientFlow: newValue,
    });
  };

  const handleFeatureToggles = (e) => {
    setFeatureToggles({
      ...featureToggles,
      [e.target.name]: e.target.checked,
    });
  };

  const handleDeviceSettingsChange = (e) => {
    setDeviceSettings({
      ...deviceSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleAgroclimateConfigSave = () => {
    const clickTime = Date.now();
    Axios.patch(
      "/agroclimate",
      {
        refresh_time: deviceSettings.refreshTime,
        logging_time: deviceSettings.loggingTime,
        ph: agroclimateSettings.ph,
        light_intensity: agroclimateSettings.lightIntensity,
        nutrient_flow: agroclimateSettings.nutrientFlow,
        tds_max: agroclimateSettings.tdsMax,
        tds_min: agroclimateSettings.tdsMin,
        ec_max: agroclimateSettings.ecMax,
        ec_min: agroclimateSettings.ecMin,
        day_start: dayStart.toISOString(),
        day_end: dayEnd.toISOString(),
      },
      {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      }
    )
      .then(() => {
        const successResponseTime = Date.now();
        console.info(
          `Click time: ${clickTime}; Response time: ${successResponseTime}; Latency: ${
            successResponseTime - clickTime
          }`
        );
        handleSnackbarOpen(
          "The agroclimate configuration has been saved!",
          "success"
        );
      })
      .catch(() => {
        handleSnackbarOpen(
          "Failed to save the agroclimate configuration!",
          "error"
        );
      });
  };

  const handleDayStartChange = (date) => {
    setDayStart(date);
  };

  const handleDayEndChange = (date) => {
    setDayEnd(date);
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
                    value={agroclimateSettings.ph}
                    onChange={handlePhChange}
                    defaultValue={0}
                    step={0.1}
                    min={1}
                    max={12}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={agroclimateSettings.ph}
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                {/* TDS max */}
                <Grid item xs={12} sm={8}>
                  <Typography
                    variant="subtitle1"
                    className={classes.parameterCaption}
                  >
                    <Tooltip title={climateControlTooltipCaption}>
                      <InfoIcon />
                    </Tooltip>
                    TDS Maximum
                  </Typography>
                  <Slider
                    value={agroclimateSettings.tdsMax}
                    onChange={handleTdsMaxChange}
                    defaultValue={0}
                    step={1}
                    min={0}
                    max={2000}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={agroclimateSettings.tdsMax}
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
                {/* TDS min*/}
                <Grid item xs={12} sm={8}>
                  <Typography
                    variant="subtitle1"
                    className={classes.parameterCaption}
                  >
                    <Tooltip title={climateControlTooltipCaption}>
                      <InfoIcon />
                    </Tooltip>
                    TDS Minimum
                  </Typography>
                  <Slider
                    value={agroclimateSettings.tdsMin}
                    onChange={handleTdsMinChange}
                    defaultValue={0}
                    step={1}
                    min={0}
                    max={2000}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={agroclimateSettings.tdsMin}
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
                {/* Electrical conductivity max*/}
                <Grid item xs={12} sm={8}>
                  <Typography
                    variant="subtitle1"
                    className={classes.parameterCaption}
                  >
                    <Tooltip title={climateControlTooltipCaption}>
                      <InfoIcon />
                    </Tooltip>
                    Electrical Conductivity Maximum
                  </Typography>
                  <Slider
                    value={agroclimateSettings.ecMax}
                    onChange={handleEcMaxChange}
                    defaultValue={0}
                    step={0.1}
                    min={0}
                    max={10}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={agroclimateSettings.ecMax}
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
                {/* Electrical conductivity max*/}
                <Grid item xs={12} sm={8}>
                  <Typography
                    variant="subtitle1"
                    className={classes.parameterCaption}
                  >
                    <Tooltip title={climateControlTooltipCaption}>
                      <InfoIcon />
                    </Tooltip>
                    Electrical Conductivity Minimum
                  </Typography>
                  <Slider
                    value={agroclimateSettings.ecMin}
                    onChange={handleEcMinChange}
                    defaultValue={0}
                    step={0.1}
                    min={0}
                    max={10}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={agroclimateSettings.ecMin}
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
                    value={agroclimateSettings.lightIntensity}
                    onChange={handleLightIntensityChange}
                    defaultValue={0}
                    step={1}
                    min={0}
                    max={40000}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={agroclimateSettings.lightIntensity}
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
                    value={agroclimateSettings.nutrientFlow}
                    onChange={handleNutrientFlowChange}
                    defaultValue={0}
                    step={0.1}
                    min={0}
                    max={10}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    value={agroclimateSettings.nutrientFlow}
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
                  name="refreshTime"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">ms</InputAdornment>
                    ),
                  }}
                  value={deviceSettings.refreshTime}
                  onChange={handleDeviceSettingsChange}
                  type="number"
                  variant="filled"
                  fullWidth
                  className={classes.deviceConfigTextField}
                />
                <TextField
                  label="Agroclimate Parameters Logging Interval"
                  name="loggingTime"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">ms</InputAdornment>
                    ),
                  }}
                  value={deviceSettings.loggingTime}
                  onChange={handleDeviceSettingsChange}
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
                    value={dayStart}
                    onChange={handleDayStartChange}
                    className={classes.timePicker}
                  />
                  <TimePicker
                    margin="dense"
                    variant="inline"
                    label="Day end time"
                    format="HH:mm:ss"
                    views={["hours", "minutes", "seconds"]}
                    value={dayEnd}
                    onChange={handleDayEndChange}
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
