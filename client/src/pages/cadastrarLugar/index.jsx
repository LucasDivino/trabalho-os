import {
  Container,
  makeStyles,
  Grid,
  Typography,
  TextField,
  Icon,
  Checkbox,
  Button,
  FormControlLabel,
} from "@material-ui/core";
import * as React from "react";
import { useState, useContext, useCallback } from "react";
import AuthContext from "../../context";
import { post } from "../../services";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import RoomIcon from "@material-ui/icons/Room";
import ReactMapGL, { GeolocateControl, Marker } from "react-map-gl";

const TOKEN =
  "pk.eyJ1IjoibHVjYXNkaXZpbm8iLCJhIjoiY2twMDVvN3F6MTBtMjJwcGc5a216bGhtZSJ9.wOR3VpDuf_gN5uwrXYpY2g";

const geolocateStyle = {
  float: "left",
  margin: "50px",
  padding: "10px",
};

const useStyles = makeStyles((theme) => ({
  wrapper: {
    marginTop: theme.spacing(2),
  },
  largeIcon: {
    fontSize: 35,
  },
  helpText: {
    color: "#999",
  },
}));

const CadastrarAluno = () => {
  const classes = useStyles();
  const { auth } = useContext(AuthContext);

  const { values, handleSubmit, setFieldValue } = useFormik({
    initialValues: { name: "", destino: false },
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async () => {
      await post(
        "user/places/",
        {
          latitude: location.latitude,
          longitude: location.longitude,
          destino: values.destino,
          user: auth.user,
          name: values.name,
        },
        { Authorization: `token ${auth.token}` }
      );
      toast.success("Lugar Cadastrado com sucesso");
    },
  });

  const handleChange = useCallback(
    (e) => {
      setFieldValue(e.currentTarget.name, e.currentTarget.value);
    },
    [setFieldValue]
  );

  const handleChangeCheckbox = useCallback(
    (e) => {
      setFieldValue("destino", e.currentTarget.checked);
    },
    [setFieldValue]
  );

  const [location, setLocation] = useState({
    visible: false,
    longitude: 0,
    latitude: 0,
  });

  const [viewport, setViewport] = useState({
    width: "100%",
    height: 400,
    latitude: 0,
    longitude: 0,
    zoom: 1,
  });

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container className={classes.wrapper} spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h4">Cadastrar Lugar</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              onChange={handleChange}
              name="name"
              value={values.name}
              variant="outlined"
              placeholder="Nome do lugar"
              label="Nome"
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="Latitude"
              disabled={true}
              value={location.latitude}
            />
          </Grid>
          <Grid item>
            <TextField
              variant="outlined"
              label="Longitude"
              disabled={true}
              value={location.longitude}
            />
          </Grid>
          <Grid item>
            <FormControlLabel
              style={{ paddingTop: 5 }}
              label="Este local é um destino?"
              control={
                <Checkbox
                  checked={values.destino}
                  onChange={handleChangeCheckbox}
                />
              }
            />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.helpText}>
              Marque no mapa o endereço no lugar no mapa
            </Typography>
            <ReactMapGL
              {...viewport}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              onViewportChange={(nextViewport) => setViewport(nextViewport)}
              mapboxApiAccessToken={TOKEN}
              onClick={(event) =>
                setLocation({
                  visible: true,
                  latitude: event.lngLat[1],
                  longitude: event.lngLat[0],
                })
              }
            >
              <GeolocateControl
                style={geolocateStyle}
                positionOptions={{ enableHighAccuracy: true }}
                trackUserLocation={true}
              />
              {location.visible && (
                <Marker
                  latitude={location.latitude}
                  longitude={location.longitude}
                  offsetLeft={-20}
                  offsetTop={-10}
                >
                  <Icon color="primary">
                    <RoomIcon className={classes.largeIcon} />
                  </Icon>
                </Marker>
              )}
            </ReactMapGL>
          </Grid>
          <Grid container justify="center">
            <Grid item>
              <Button variant="contained" color="primary" type="submit">
                Cadastrar
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default CadastrarAluno;
