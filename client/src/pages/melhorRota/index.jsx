import { Container, Grid, Icon, Typography } from "@material-ui/core";
import React, { useState } from "react";
import RoomIcon from "@material-ui/icons/Room";
import ReactMapGL, { GeolocateControl, Marker } from "react-map-gl";

const TOKEN =
  "pk.eyJ1IjoibHVjYXNkaXZpbm8iLCJhIjoiY2twMDVvN3F6MTBtMjJwcGc5a216bGhtZSJ9.wOR3VpDuf_gN5uwrXYpY2g";

// navigator.geolocation.getCurrentPosition((position) => {
//   console.log(position.coords.latitude, position.coords.longitude);
// });

const geolocateStyle = {
  float: "left",
  margin: "50px",
  padding: "10px",
};

const CadastrarAluno = () => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: 600,
    latitude: 0,
    longitude: 0,
    zoom: 1,
  });

  return (
    <Container>
      <Grid container spacing={3} style={{ marginTop: 8 }}>
        <Grid item xs={12}>
          <Typography variant="h4">Melhor caminhno</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            O melhor caminho é: Casa, Pedro, João, Colégio. Nesta ordem
          </Typography>
          <ReactMapGL
            {...viewport}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
            mapboxApiAccessToken={TOKEN}
          >
            <GeolocateControl
              style={geolocateStyle}
              positionOptions={{ enableHighAccuracy: true }}
              trackUserLocation={true}
            />
            <Marker
              latitude={-19.837650144748974}
              longitude={-43.97473440976715}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Icon color="primary">
                <RoomIcon style={{ fontSize: 35 }} />
              </Icon>
              <Typography
                style={{ fontSize: 10, marginLeft: 8, marginTop: -10 }}
              >
                Casa
              </Typography>
            </Marker>
            <Marker
              latitude={-19.835951854441088}
              longitude={-43.974499475039956}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Icon color="primary">
                <RoomIcon style={{ fontSize: 35 }} />
              </Icon>
              <Typography
                style={{ fontSize: 10, marginLeft: 8, marginTop: -10 }}
              >
                Pedro
              </Typography>
            </Marker>
            <Marker
              latitude={-19.836181855916426}
              longitude={-43.977345345625174}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Icon color="primary">
                <RoomIcon style={{ fontSize: 35 }} />
              </Icon>
              <Typography
                style={{ fontSize: 10, marginLeft: 8, marginTop: -10 }}
              >
                João
              </Typography>
            </Marker>
            <Marker
              latitude={-19.839895330111112}
              longitude={-43.97770724349457}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Icon color="primary">
                <RoomIcon style={{ fontSize: 35 }} />
              </Icon>
              <Typography
                style={{ fontSize: 10, marginLeft: 8, marginTop: -10 }}
              >
                Colégio
              </Typography>
            </Marker>
          </ReactMapGL>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CadastrarAluno;
