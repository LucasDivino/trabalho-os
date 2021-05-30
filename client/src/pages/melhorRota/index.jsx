import { Container, Grid, Icon, Typography } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import RoomIcon from "@material-ui/icons/Room";
import ReactMapGL, { GeolocateControl, Marker } from "react-map-gl";
import AuthContext from "../../context";
import { get } from "../../services";

const TOKEN =
  "pk.eyJ1IjoibHVjYXNkaXZpbm8iLCJhIjoiY2twMDVvN3F6MTBtMjJwcGc5a216bGhtZSJ9.wOR3VpDuf_gN5uwrXYpY2g";

const geolocateStyle = {
  float: "left",
  margin: "50px",
  padding: "10px",
};

const CadastrarAluno = () => {
  const { auth } = useContext(AuthContext);
  const [route, setRoute] = useState([]);

  const [viewport, setViewport] = useState({
    width: "100%",
    height: 600,
    latitude: 0,
    longitude: 0,
    zoom: 1,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const response = await get(
        `user/result?user_id=${auth.user}&latitude=${coords.latitude}&longitude=${coords.longitude}`,
        { Authorization: `token ${auth.token}` }
      );
      setRoute(response.data);
    });
  }, [auth]);

  console.log(route);

  return (
    <Container>
      <Grid container spacing={3} style={{ marginTop: 8 }}>
        <Grid item xs={12}>
          <Typography variant="h4">Melhor caminhno</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            O melhor caminho para sua localização atual é:
            {route.map((element, index) =>
              index !== route.length - 1
                ? ` ${element.name},`
                : ` ${element.name}.`
            )}
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
            {route.map((element, index) => (
              <Marker
                key={index}
                latitude={parseFloat(element.latitude)}
                longitude={parseFloat(element.longitude)}
                offsetLeft={-20}
                offsetTop={-10}
              >
                <Icon color="primary">
                  <RoomIcon style={{ fontSize: 35 }} />
                </Icon>
                <Typography
                  color="dark"
                  style={{
                    fontSize: 12,
                    marginLeft: 8,
                    marginTop: -10,
                    fontWeight: "bold",
                  }}
                >
                  {element.name}
                </Typography>
              </Marker>
            ))}
          </ReactMapGL>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CadastrarAluno;
