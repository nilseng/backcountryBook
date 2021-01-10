import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const Mapbox = () => {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "";

  const [mapState] = useState({
    lng: 8.739,
    lat: 61.448,
    zoom: 12,
    pitch: 85,
    bearing: 80,
  });

  const mapEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapEl.current && mapboxgl.accessToken) {
      const map = new mapboxgl.Map({
        container: mapEl.current,
        style: "mapbox://styles/nilseng/ckiuk1uf02ykx19szgx4psp19",
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
        pitch: 45,
        bearing: 80,
      });

      map.on("load", function () {
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

        // add a sky layer that will show when the map is highly pitched
        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 0.0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });
      });

      map.on("click", (e) => {
        if (e.lngLat) new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);
      });
    }
  }, [mapEl, mapState]);

  return (
    <div
      ref={mapEl}
      id="map"
      className="vw-100"
      style={{
        position: "relative",
        height: "calc(100vh - 58px)",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
      }}
    ></div>
  );
};

export default Mapbox;
