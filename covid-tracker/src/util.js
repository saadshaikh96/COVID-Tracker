import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const categoryColors = {
  cases: {
    color: "#ff9900",
    multiplier: 250,
  },
  recovered: {
    color: "green",
    multiplier: 400,
  },
  deaths: {
    color: "red",
    multiplier: 2000,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

export const displayDataOnMap = (data, category = "cases") => {
  console.log("Category = ", category);
  console.log("Circle color = ", categoryColors[category].color);

  return data.map((country) => (
    <Circle
      pathOptions={{
        color: categoryColors[category].color,
        fillColor: categoryColors[category].color,
      }}
      center={[country.countryInfo.lat, country.countryInfo.long]}
      // color={categoryColors[category].color}
      // fillColor={categoryColors[category].color}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[category]) * categoryColors[category].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
};

export const prettifyStatistic = (stat) =>
  stat ? `${numeral(stat).format("0.0a")}` : "0";
