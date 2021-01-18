import React from "react";
import { MapContainer as LeafletMap, TileLayer, useMap } from "react-leaflet";
import { displayDataOnMap } from "./util";
import "./Map.css";

function Map({ countries, category, center, zoom }) {
  return (
    <div className="map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {displayDataOnMap(countries, category)}
      </LeafletMap>
    </div>
  );
}

export default Map;
