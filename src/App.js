import { useEffect, useState } from "react";
import { CssBaseline, Grid } from "@material-ui/core";
import Header from "components/Header/Header";
import List from "components/List/List";
import Map from "components/Map/Map";

import { getPlacesData, getWeatherData } from "api";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [coords, setCoords] = useState({});
  const [bounds, setBounds] = useState({});
  const [childClicked, setChildClicked] = useState(null);
  const [type, setType] = useState("restaurants");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoords({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    (async () => {
      if (bounds.sw && bounds.ne) {
        setLoading(true);

        const weather = await getWeatherData(coords.lat, coords.lng);
        setWeatherData(weather);

        const data = await getPlacesData(type, bounds.sw, bounds.ne);
        setFilteredPlaces([]);
        setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
        setLoading(false);
      }
    })();
  }, [type, bounds]);

  useEffect(() => {
    const _filteredPlaces = places.filter((place) => place.rating > rating);
    setFilteredPlaces(_filteredPlaces);
  }, [rating]);

  return (
    <>
      <CssBaseline />
      <Header setCoords={setCoords} />
      <Grid container spacing={3} style={{ width: "100%" }}>
        <Grid item xs={12} md={4}>
          <List
            places={filteredPlaces.length ? filteredPlaces : places}
            childClicked={childClicked}
            loading={loading}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoords={setCoords}
            setBounds={setBounds}
            coords={coords}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClicked={setChildClicked}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;
