import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";

import MiniDrawer from "../components/Drawer";
import Loading from "../components/Loading";

import Paper from "@material-ui/core/Paper";

import { useCookies } from "react-cookie";
import { Redirect } from "react-router-dom";
import Axios from "axios";

import ReactHlsPlayer from "react-hls-player";

const useStyles = makeStyles((theme) => ({
  defaultPaper: {
    padding: theme.spacing(2),
    maxWidth: "85%",
  },
}));

export default function ClimatePage(props) {
  const classes = useStyles();

  const [cookies, setCookies, removeCookies] = useCookies();

  const [loading, setLoading] = useState(false);
  const [redirect, setRedirect] = useState();

  if (redirect) return <Redirect to={redirect} />;

  if (loading)
    return (
      <MiniDrawer title="Dashboard">
        <Loading />
      </MiniDrawer>
    );

  return (
    <MiniDrawer title="CCTV">
      <Paper className={classes.defaultPaper}>
        <ReactHlsPlayer
          src="https://server-jkt.fikrirp.com:8080/hls/cek.m3u8"
          autoPlay={false}
          controls={true}
          width="100%"
          height="auto"
        />
      </Paper>
    </MiniDrawer>
  );
}
