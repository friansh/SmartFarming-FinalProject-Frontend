import React, { useEffect, useState } from "react";
import MiniDrawer from "../components/Drawer";

import { Line } from "react-chartjs-2";

import { makeStyles } from "@material-ui/core/styles";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import Axios from "axios";
import { useCookies } from "react-cookie";
import { Redirect } from "react-router";

const useStyles = makeStyles((theme) => ({
  defaultPaper: {
    padding: theme.spacing(2),
  },
  graphMainContainer: {
    marginTop: theme.spacing(2),
  },
  startDatePicker: {
    marginRight: theme.spacing(2),
  },
  timeWindowInput: {
    width: "100%",
  },
  imageSnapshotCardTitle: {
    marginBottom: theme.spacing(1),
    textAlign: "center",
    fontWeight: "bold",
  },
  snapshotImage: {
    borderStyle: "solid",
    borderColor: "black",
    borderWidth: 1,
  },
  paperLoadingContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
  graphCardTitle: {
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  snapshotImageContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
}));

const graphSettings = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      display: false,
    },
  },
  animation: true,
};

const generalDataSettings = {
  pointRadius: 0.1,
  fill: false,
  lineTension: 0.3,
};

export default function LogPage(props) {
  const classes = useStyles();
  const [cookies] = useCookies();

  const [startDate, setStartDate] = useState(() => {
    let date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  });
  const [endDate, setEndDate] = useState(() => {
    let date = new Date();
    return date;
  });
  const [timeWindow, setTimeWindow] = useState(1);

  const [pHData, setPHData] = useState();
  const [lightIntensityData, setLightIntensityData] = useState();
  const [nutrientFlowData, setNutrientFlowData] = useState();
  const [TDSData, setTDSData] = useState();
  const [ECData, setECData] = useState();
  const [timeData, setTimeData] = useState([]);
  const [imageData, setImageData] = useState();

  const [snapshotIndex, setSnapshotIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [redirect, setRedirect] = useState();

  useEffect(() => {
    Axios.get("/log", {
      headers: {
        Authorization: `Bearer ${cookies.access_token}`,
      },
    })
      .then((response) => {
        if (!response.data) return;

        const timeLabel = response.data.map((data) => {
          let timestamp = new Date(data.createdAt);
          return timestamp.toString();
        });
        setTimeData(timeLabel);
        setPHData({
          labels: timeLabel,
          datasets: [
            {
              label: "pH",
              borderColor: "#7f8c8d",
              data: response.data.map((data) => data.ph),
              ...generalDataSettings,
            },
          ],
        });
        setLightIntensityData({
          labels: timeLabel,
          datasets: [
            {
              label: "Light Intensity (luc)",
              borderColor: "#34495e",
              data: response.data.map((data) => data.light_intensity),
              ...generalDataSettings,
            },
          ],
        });
        setNutrientFlowData({
          labels: timeLabel,
          datasets: [
            {
              label: "Nutrient Flow (l/m)",
              borderColor: "#2ecc71",
              data: response.data.map((data) => data.nutrient_flow),
              ...generalDataSettings,
            },
          ],
        });
        setTDSData({
          labels: timeLabel,
          datasets: [
            {
              label: "Total Dissolved Solid (ppm)",
              borderColor: "#3498db",
              data: response.data.map((data) => data.tds),
              ...generalDataSettings,
            },
          ],
        });
        setECData({
          labels: timeLabel,
          datasets: [
            {
              label: "Electrical Conductivity (S)",
              borderColor: "#c0392b",
              data: response.data.map((data) => data.ec),
              ...generalDataSettings,
            },
          ],
        });
        setImageData(response.data.map((data) => data.image_url));
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.response.data.message);
        if (error.response.status === 401) setRedirect("/login");
      });
  }, [cookies.access_token]);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleTimeWindowChange = (event) => {
    setTimeWindow(event.target.value);
  };

  const handleChangeSnapshotIndex = (event, newValue) => {
    // console.log(imageData[newValue]);
    setSnapshotIndex(newValue);
  };

  if (redirect) return <Redirect to={redirect} />;

  return (
    <MiniDrawer title="Journal">
      <Paper className={classes.defaultPaper}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <FormControl variant="outlined" className={classes.timeWindowInput}>
              <InputLabel id="time-window-select">Time Window</InputLabel>
              <Select
                labelId="time-window-select"
                value={timeWindow}
                onChange={handleTimeWindowChange}
                label="Time Window"
              >
                <MenuItem value={-30}>Last 30 days</MenuItem>
                <MenuItem value={-7}>Last 7 days</MenuItem>
                <MenuItem value={-2}>Yesterday</MenuItem>
                <MenuItem value={30}>This month</MenuItem>
                <MenuItem value={7}>This week</MenuItem>
                <MenuItem value={1}>Today</MenuItem>
                <MenuItem value={0}>Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {timeWindow === 0 ? (
            <Grid item xs={12} md={9}>
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="DD/MM/yyyy"
                  margin="dense"
                  label="Start date"
                  value={startDate}
                  onChange={handleStartDateChange}
                  className={classes.startDatePicker}
                />
                <KeyboardDatePicker
                  disableToolbar
                  variant="inline"
                  format="DD/MM/yyyy"
                  margin="dense"
                  label="End date"
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </MuiPickersUtilsProvider>
            </Grid>
          ) : null}
        </Grid>
      </Paper>
      <Grid container spacing={3} className={classes.graphMainContainer}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.defaultPaper}>
            {loading ? (
              <div className={classes.paperLoadingContainer}>
                <CircularProgress size={24} />
              </div>
            ) : (
              <React.Fragment>
                <Typography
                  variant="subtitle1"
                  className={classes.graphCardTitle}
                >
                  pH
                </Typography>
                <Line data={pHData} options={graphSettings} />
                <TableContainer component={Paper} style={{ marginTop: 15 }}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Parameter
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }} align="right">
                          Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Mean
                        </TableCell>
                        <TableCell align="right">12</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Median
                        </TableCell>
                        <TableCell align="right">13</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Mode
                        </TableCell>
                        <TableCell align="right">14</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Standard Deviation
                        </TableCell>
                        <TableCell align="right">15</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.defaultPaper}>
            {loading ? (
              <div className={classes.paperLoadingContainer}>
                <CircularProgress size={24} />
              </div>
            ) : (
              <React.Fragment>
                <Typography
                  variant="subtitle1"
                  className={classes.graphCardTitle}
                >
                  Light Intensity (lux)
                </Typography>
                <Line data={lightIntensityData} options={graphSettings} />
                <TableContainer component={Paper} style={{ marginTop: 15 }}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Parameter
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }} align="right">
                          Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Mean
                        </TableCell>
                        <TableCell align="right">12</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Median
                        </TableCell>
                        <TableCell align="right">13</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Mode
                        </TableCell>
                        <TableCell align="right">14</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Standard Deviation
                        </TableCell>
                        <TableCell align="right">15</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.defaultPaper}>
            {loading ? (
              <div className={classes.paperLoadingContainer}>
                <CircularProgress size={24} />
              </div>
            ) : (
              <React.Fragment>
                <Typography
                  variant="subtitle1"
                  className={classes.graphCardTitle}
                >
                  Nutrient Flow (l/m)
                </Typography>
                <Line data={nutrientFlowData} options={graphSettings} />
                <TableContainer component={Paper} style={{ marginTop: 15 }}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Parameter
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }} align="right">
                          Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Mean
                        </TableCell>
                        <TableCell align="right">12</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Median
                        </TableCell>
                        <TableCell align="right">13</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Mode
                        </TableCell>
                        <TableCell align="right">14</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Standard Deviation
                        </TableCell>
                        <TableCell align="right">15</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.defaultPaper}>
            {loading ? (
              <div className={classes.paperLoadingContainer}>
                <CircularProgress size={24} />
              </div>
            ) : (
              <React.Fragment>
                <Typography
                  variant="subtitle1"
                  className={classes.graphCardTitle}
                >
                  Total Dissolved Solid (ppm)
                </Typography>
                <Line data={TDSData} options={graphSettings} />
                <TableContainer component={Paper} style={{ marginTop: 15 }}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Parameter
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }} align="right">
                          Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Mean
                        </TableCell>
                        <TableCell align="right">12</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Median
                        </TableCell>
                        <TableCell align="right">13</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Mode
                        </TableCell>
                        <TableCell align="right">14</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Standard Deviation
                        </TableCell>
                        <TableCell align="right">15</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper className={classes.defaultPaper}>
            {loading ? (
              <div className={classes.paperLoadingContainer}>
                <CircularProgress size={24} />
              </div>
            ) : (
              <React.Fragment>
                <Typography
                  variant="subtitle1"
                  className={classes.graphCardTitle}
                >
                  Electrical Conductivity (S)
                </Typography>
                <Line data={ECData} options={graphSettings} />
                <TableContainer component={Paper} style={{ marginTop: 15 }}>
                  <Table size="small" aria-label="a dense table">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ fontWeight: "bold" }}>
                          Parameter
                        </TableCell>
                        <TableCell style={{ fontWeight: "bold" }} align="right">
                          Value
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Mean
                        </TableCell>
                        <TableCell align="right">12</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Median
                        </TableCell>
                        <TableCell align="right">13</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Mode
                        </TableCell>
                        <TableCell align="right">14</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th" scope="row">
                          Standard Deviation
                        </TableCell>
                        <TableCell align="right">15</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </React.Fragment>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.defaultPaper}>
            <Typography
              variant="subtitle1"
              className={classes.imageSnapshotCardTitle}
            >
              Snapshot
            </Typography>
            {loading ? (
              <div className={classes.paperLoadingContainer}>
                <CircularProgress size={24} />
              </div>
            ) : (
              <React.Fragment>
                <div className={classes.snapshotImageContainer}>
                  <img
                    alt=""
                    // style={{
                    //   backgroundImage: `url('${}')`,
                    // }}
                    className={classes.snapshotImage}
                    src={imageData[snapshotIndex]}
                  />
                </div>
                <Slider
                  onChangeCommitted={handleChangeSnapshotIndex}
                  defaultValue={0}
                  step={1}
                  marks
                  min={0}
                  max={timeData.length - 1}
                />
                <Typography variant="caption">
                  {timeData[snapshotIndex]}
                </Typography>
              </React.Fragment>
            )}
          </Paper>
        </Grid>
      </Grid>
    </MiniDrawer>
  );
}
