import React, { useState, useEffect } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@material-ui/core";
import StatsTile from "./StatsTile";
import Map from "./Map";
import Table from "./Table";
import LineGraph from "./LineGraph";
import { sortData } from "./util";
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const baseURL = "https://disease.sh/v3/covid-19";

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("Worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState([20.80746, 36.4796]);
  const [mapZoom, setMapZoom] = useState(2);
  const [category, setCategory] = useState("cases");

  useEffect(async () => {
    const url = baseURL + "/all";
    const response = await fetch(url);
    const data = await response.json();
    setCountryInfo(data);
  }, []);

  // To populate the dropdown
  useEffect(() => {
    const getCountriesData = async () => {
      const countriesURL = baseURL + "/countries";
      const response = await fetch(countriesURL);
      const data = await response.json();
      const countries = data.map((country) => ({
        name: country.country,
        code: country.countryInfo.iso2,
      }));

      const sortedData = sortData(data);
      setTableData(sortedData);
      setMapCountries(data);
      setCountries(countries);
    };

    getCountriesData();
  }, []);

  const changeCountry = async (e) => {
    const countryCode = e.target.value;
    const extension =
      countryCode === "Worldwide" ? "/all" : `/countries/${countryCode}`;
    const url = baseURL + extension;

    const response = await fetch(url);
    const data = await response.json();
    setCountry(countryCode);
    setCountryInfo(data);
    countryCode === "Worldwide"
      ? setMapCenter([20.80746, 36.4796])
      : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    setMapZoom(4);
  };

  // console.log(countryInfo);
  return (
    <div className="app">
      <div className="app__lefthalf">
        {/* Title and dropdown for country selection */}
        <div className="app__header">
          <h1>COVID TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={changeCountry} value={country}>
              <MenuItem value="Worldwide"> Worldwide </MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.code}> {country.name} </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Tiles -> Cases, deaths, recovered */}
        <div className="app__statstile">
          <StatsTile
            onClick={(e) => setCategory("cases")}
            isActive={category === "cases"}
            title="Cases"
            perMillion={countryInfo.casesPerOneMillion}
            total={countryInfo.cases}
            isOrange={true}
          />
          {/* <StatsTile
            title="Tests"
            perMillion={countryInfo.testsPerOneMillion}
            total={countryInfo.tests}
          />
          <StatsTile
            title="Active"
            perMillion={countryInfo.activePerOneMillion}
            total={countryInfo.active}
          /> */}
          <StatsTile
            onClick={(e) => setCategory("recovered")}
            isActive={category === "recovered"}
            title="Recoveries"
            perMillion={countryInfo.recoveredPerOneMillion}
            total={countryInfo.recovered}
            isGreen={true}
          />
          <StatsTile
            onClick={(e) => setCategory("deaths")}
            isActive={category === "deaths"}
            title="Deaths"
            perMillion={countryInfo.deathsPerOneMillion}
            total={countryInfo.deaths}
            isRed={true}
          />
        </div>

        {/* World map */}
        <div className="app__map">
          <Map
            category={category}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>

      <Card className="app__righthalf">
        <CardContent className="app__righthalfCard">
          <div className="app__righthalfCardContent">
            <h3> Live cases by country </h3>
            <Table countries={tableData} />

            <h3> Worldwide {category} </h3>
            <LineGraph category={category} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
