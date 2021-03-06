import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import MiniDrawer from "../components/Drawer";
import Loading from "../components/Loading";

import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import AccessTimeIcon from "@material-ui/icons/AccessTime";
import NightsStayIcon from "@material-ui/icons/NightsStay";
import WbSunnyIcon from "@material-ui/icons/WbSunny";
import WatchLaterIcon from "@material-ui/icons/WatchLater";
import WbIncandescentIcon from "@material-ui/icons/WbIncandescent";
import WavesIcon from "@material-ui/icons/Waves";
import InvertColorsIcon from "@material-ui/icons/InvertColors";
import LocalDrinkIcon from "@material-ui/icons/LocalDrink";
import BubbleChartIcon from "@material-ui/icons/BubbleChart";
import WarningIcon from "@material-ui/icons/Warning";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import ScheduleIcon from "@material-ui/icons/Schedule";

import { yellow, blue, teal, red } from "@material-ui/core/colors";

import Axios from "axios";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";

import io from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: 20,
  },
  pageHeader: {
    backgroundColor: blue[500],
    margin: theme.spacing(-3),
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingBottom: theme.spacing(10),

    boxShadow: theme.shadows[24],
  },
  welcomeText: {
    marginTop: theme.spacing(2),
    color: theme.palette.getContrastText(blue[500]),
    textShadow: "2px 2px 5px rgba(0,0,0,0.3)",
  },
  mainGrid: {
    marginTop: theme.spacing(-7),
    justifyContent: "center",
  },
  dtcAvatar: {
    boxShadow: theme.shadows[4],
    backgroundColor: yellow[600],
    position: "absolute",
    marginLeft: -30,
    marginTop: -30,
    width: 35,
    height: 35,
    padding: 5,
  },
  agdAvatar: {
    boxShadow: theme.shadows[4],
    backgroundColor: teal[700],
    position: "absolute",
    marginLeft: -30,
    marginTop: -30,
    width: 35,
    height: 35,
    padding: 5,
  },
  agdIcon: {
    color: theme.palette.getContrastText(teal[700]),
    height: "100%",
    width: "100%",
  },
  dtcIcon: {
    color: theme.palette.getContrastText(yellow[600]),
    height: "100%",
    width: "100%",
  },
  dtcTitle: {
    marginLeft: 5,
  },
  dtcValue: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    fontSize: 32,
    fontWeight: "bold",
  },
  graphCardTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  avgValue: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    fontSize: 32,
    fontWeight: "bold",
  },
  capturedImageContainer: {
    // marginTop: theme.spacing(2),
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
  lastUpdateBox: {
    marginTop: theme.spacing(2),
    display: "flex",
    width: "100%",
    justifyContent: "end",
  },
  lastUpdate: {
    padding: theme.spacing(1),
  },
  parameterWarning: {
    color: red[500],
  },
}));

export default function DashboardPage(props) {
  const classes = useStyles();
  const [cookies] = useCookies();

  const [redirect, setRedirect] = useState();
  const [loading, setLoading] = useState(true);

  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [dayStartTime, setDayStartTime] = useState(new Date());
  const [dayEndTime, setDayEndTime] = useState(new Date());

  const [pH, setPH] = useState();
  const [lightIntensityInside, setLightIntensityInside] = useState();
  const [lightIntensityOutside, setLightIntensityOutside] = useState();
  const [nutrientFlow, setNutrientFlow] = useState();
  const [TDS, setTDS] = useState();
  const [EC, setEC] = useState();
  const [agroclimateTimestamp, setAgroclimateTimestamp] = useState(new Date());

  const [thresholds, setThresholds] = useState({
    tdsMax: undefined,
    tdsMin: undefined,
    ecMax: undefined,
    ecMin: undefined,
    lightIntensity: undefined,
    ph: undefined,
    nutrientFlow: undefined,
  });

  useEffect(() => {
    const socket = io.connect(process.env.REACT_APP_SOCKETIO_URL);

    Axios.get("/user", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    })
      .then((response) => {
        setFullname(response.data.fullname);
        setEmail(response.data.email);
        setAddress(response.data.address);

        socket.on(response.data.user_id, (data) => {
          const agroclimateData = JSON.parse(data);
          setPH(agroclimateData.ph);
          setLightIntensityInside(agroclimateData.light_intensity_inside);
          setLightIntensityOutside(agroclimateData.light_intensity_outside);
          setNutrientFlow(agroclimateData.nutrient_flow);
          setTDS(agroclimateData.tds);
          setEC(agroclimateData.ec);
          setAgroclimateTimestamp(new Date());
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error(error.response.data.message);
        if (error.response.status === 401) setRedirect("/login");
      });

    Axios.get("/agroclimate", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    }).then((response) => {
      setDayStartTime(new Date(response.data.day_start));
      setDayEndTime(new Date(response.data.day_end));
      setThresholds({
        tdsMax: response.data.tds_max,
        tdsMin: response.data.tds_min,
        ecMax: response.data.ec_max,
        ecMin: response.data.ec_min,
        lightIntensity: response.data.light_intensity,
        ph: response.data.ph,
        nutrientFlow: response.data.nutrient_flow,
      });
    });

    Axios.get("/log/latest", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    }).then((response) => {
      const agroclimateData = response.data;
      setPH(agroclimateData.ph);
      setLightIntensityInside(agroclimateData.light_intensity_inside);
      setLightIntensityOutside(agroclimateData.light_intensity_outside);
      setNutrientFlow(agroclimateData.nutrient_flow);
      setTDS(agroclimateData.tds);
      setEC(agroclimateData.ec);
      setAgroclimateTimestamp(new Date(agroclimateData.createdAt));
    });
  }, []);

  if (redirect) return <Redirect to={redirect} />;

  if (loading)
    return (
      <MiniDrawer title="Dashboard">
        <Loading />
      </MiniDrawer>
    );

  function getTimeDiff(time2, time1) {
    var msec = time2 - time1;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    return `${Math.abs(hh)}h ${Math.abs(mm)}m ${Math.abs(ss)}s`;
  }

  return (
    <MiniDrawer title="Dashboard">
      <div className={classes.pageHeader}>
        <Typography variant="h5" className={classes.welcomeText}>
          Welcome, <b>{fullname}</b>!
        </Typography>
        <TableContainer component={Paper} style={{ marginTop: 15 }}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: "bold" }}>Parameter</TableCell>
                <TableCell style={{ fontWeight: "bold" }} align="right">
                  Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Email
                </TableCell>
                <TableCell align="right">{email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Address
                </TableCell>
                <TableCell align="right">{address}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <Grid container spacing={2} className={classes.mainGrid}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Avatar className={classes.dtcAvatar}>
              <AccessTimeIcon className={classes.dtcIcon} />
            </Avatar>
            <Typography
              variant="h6"
              style={{ marginLeft: 5 }}
              className={classes.dtcTitle}
            >
              Day Start Time
              <Typography variant="body1" className={classes.dtcValue}>
                {dayStartTime.toLocaleTimeString()}
              </Typography>
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Avatar className={classes.dtcAvatar}>
              <WatchLaterIcon className={classes.dtcIcon} />
            </Avatar>
            <Typography variant="h6">Day End Time</Typography>
            <Typography variant="body1" className={classes.dtcValue}>
              {dayEndTime.toLocaleTimeString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Avatar className={classes.dtcAvatar}>
              <WbSunnyIcon className={classes.dtcIcon} />
            </Avatar>
            <Typography variant="h6">Day Length</Typography>
            <Typography variant="body1" className={classes.dtcValue}>
              {getTimeDiff(dayEndTime, dayStartTime)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Avatar className={classes.dtcAvatar}>
              <NightsStayIcon className={classes.dtcIcon} />
            </Avatar>
            <Typography variant="h6">Night Length</Typography>
            <Typography variant="body1" className={classes.dtcValue}>
              {getTimeDiff(dayStartTime, dayEndTime)}
            </Typography>
          </Paper>
        </Grid>
        {/* pH */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Avatar className={classes.agdAvatar}>
              <InvertColorsIcon className={classes.agdIcon} />
            </Avatar>
            <Typography variant="h6">pH</Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" className={classes.avgValue}>
                  {Math.round((pH + Number.EPSILON) * 10) / 10}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {pH < thresholds.ph * 0.9 || pH > thresholds.ph * 1.1 ? (
                  <>
                    <Tooltip title="The installation pH correcting state. Check regularly to ensure.">
                      <RadioButtonCheckedIcon />
                    </Tooltip>
                    <Typography variant="body1">Correcting...</Typography>
                  </>
                ) : (
                  <>
                    <Tooltip title="The installation pH correcting state. Check regularly to ensure.">
                      <RadioButtonUncheckedIcon />
                    </Tooltip>
                    <Typography variant="body1">Corrected</Typography>
                  </>
                )}
              </div>
            </div>
            <hr />
            <Typography variant="caption">
              Setpoint:
              <ArrowDownwardIcon fontSize="small" />
              {Math.round(thresholds.ph * 0.9 * 100) / 100}{" "}
              <ArrowUpwardIcon fontSize="small" />
              {Math.round(thresholds.ph * 1.1 * 100) / 100}
            </Typography>
          </Paper>
        </Grid>
        {/* Light intensity (outside) */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Avatar className={classes.agdAvatar}>
              <WbIncandescentIcon className={classes.agdIcon} />
            </Avatar>
            <Typography variant="h6">Light Intensity (outside)</Typography>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div>
                <Typography variant="body1" className={classes.avgValue}>
                  {lightIntensityOutside} lux
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {lightIntensityOutside < thresholds.lightIntensity &&
                new Date() >
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate(),
                    dayStartTime.getHours(),
                    dayStartTime.getMinutes(),
                    dayStartTime.getSeconds()
                  ) &&
                new Date() <
                  new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    new Date().getDate(),
                    dayEndTime.getHours(),
                    dayEndTime.getMinutes(),
                    dayEndTime.getSeconds()
                  ) ? (
                  <>
                    <Tooltip title="The lamp state supposed to be. Check light intensity (inside value) to ensure.">
                      <RadioButtonCheckedIcon />
                    </Tooltip>
                    <Typography variant="body1">Lamp On</Typography>
                  </>
                ) : (
                  <>
                    <Tooltip title="The lamp state supposed to be. Check light intensity (inside value) to ensure.">
                      <RadioButtonUncheckedIcon />
                    </Tooltip>
                    <Typography variant="body1">Lamp Off</Typography>
                  </>
                )}
              </div>
            </div>
            <hr />
            <Typography variant="caption">
              Setpoint:
              <ArrowUpwardIcon fontSize="small" />
              {thresholds.lightIntensity} lux <ScheduleIcon />{" "}
              {dayStartTime.toLocaleTimeString()} -{" "}
              {dayEndTime.toLocaleTimeString()}
            </Typography>
          </Paper>
        </Grid>
        {/* Light intensity (inside) */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Avatar className={classes.agdAvatar}>
              <WbIncandescentIcon className={classes.agdIcon} />
            </Avatar>
            <Typography variant="h6">Light Intensity (inside)</Typography>
            <Typography variant="body1" className={classes.avgValue}>
              {lightIntensityInside} lux
            </Typography>
          </Paper>
        </Grid>
        {/* Nutrient flow */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Avatar className={classes.agdAvatar}>
              <WavesIcon className={classes.agdIcon} />
            </Avatar>
            <Typography variant="h6">Nutrient Flow</Typography>

            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" className={classes.avgValue}>
                  {Math.round((nutrientFlow + Number.EPSILON) * 100) / 100}{" "}
                  &#8467;/m
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {nutrientFlow < thresholds.nutrientFlow * 0.9 ||
                nutrientFlow < thresholds.nutrientFlow * 1.1 ? (
                  <>
                    <Tooltip title="The installation nutrient flow correcting state. Check regularly to ensure.">
                      <RadioButtonCheckedIcon />
                    </Tooltip>
                    <Typography variant="body1">Correcting...</Typography>
                  </>
                ) : (
                  <>
                    <Tooltip title="The installation nutrient flow correcting state. Check regularly to ensure.">
                      <RadioButtonUncheckedIcon />
                    </Tooltip>
                    <Typography variant="body1">Corrected</Typography>
                  </>
                )}
              </div>
            </div>
            <hr />
            <Typography variant="caption">
              Setpoint:
              <ArrowDownwardIcon fontSize="small" />
              {Math.round(thresholds.nutrientFlow * 0.9 * 100) / 100}{" "}
              <ArrowUpwardIcon fontSize="small" />
              {Math.round(thresholds.nutrientFlow * 1.1 * 100) / 100} &#8467;/m
            </Typography>
          </Paper>
        </Grid>
        {/* TDS */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Avatar className={classes.agdAvatar}>
              <LocalDrinkIcon className={classes.agdIcon} />
            </Avatar>
            <Typography variant="h6">
              Nutrients Total Dissolved Solid (TDS)
            </Typography>
            <Typography variant="body1" className={classes.avgValue}>
              <span
                className={
                  TDS > thresholds.tdsMax || TDS < thresholds.tdsMin
                    ? classes.parameterWarning
                    : null
                }
              >
                {Math.round(TDS + Number.EPSILON)} ppm
                {TDS > thresholds.tdsMax ? (
                  <>
                    <ArrowUpwardIcon />
                    <Tooltip title="The TDS value is above the threshold">
                      <WarningIcon />
                    </Tooltip>
                  </>
                ) : null}
                {TDS < thresholds.tdsMin ? (
                  <>
                    <ArrowDownwardIcon />
                    <Tooltip title="The TDS value is below the threshold">
                      <WarningIcon />
                    </Tooltip>
                  </>
                ) : null}
              </span>
            </Typography>
            <hr />
            <Typography variant="caption">
              Setpoint:
              <ArrowDownwardIcon fontSize="small" />
              {thresholds.tdsMin} <ArrowUpwardIcon fontSize="small" />
              {thresholds.tdsMax} ppm
            </Typography>
          </Paper>
        </Grid>
        {/* EC */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Avatar className={classes.agdAvatar}>
              <BubbleChartIcon className={classes.agdIcon} />
            </Avatar>
            <Typography variant="h6">
              Nutrients Electrical Conductivity (EC)
            </Typography>
            <Typography variant="body1" className={classes.avgValue}>
              <span
                className={
                  EC > thresholds.ecMax || EC < thresholds.ecMin
                    ? classes.parameterWarning
                    : null
                }
              >
                {Math.round((EC + Number.EPSILON) * 100) / 100} mS/cm
                {EC > thresholds.ecMax ? (
                  <>
                    <ArrowUpwardIcon />
                    <Tooltip title="The TDSc value is above the threshold">
                      <WarningIcon />
                    </Tooltip>
                  </>
                ) : null}
                {EC < thresholds.ecMin ? (
                  <>
                    <ArrowDownwardIcon />
                    <Tooltip title="The EC value is below the threshold">
                      <WarningIcon />
                    </Tooltip>
                  </>
                ) : null}
              </span>
            </Typography>
            <hr />
            <Typography variant="caption">
              Setpoint:
              <ArrowDownwardIcon fontSize="small" />
              {thresholds.ecMin} <ArrowUpwardIcon fontSize="small" />
              {thresholds.ecMax} mS/cm
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <div className={classes.lastUpdateBox}>
        <Typography className={classes.lastUpdate} variant="caption">
          last update: {agroclimateTimestamp.toLocaleString()}
        </Typography>
      </div>
    </MiniDrawer>
  );
}
