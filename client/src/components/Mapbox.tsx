import React, { useEffect, useRef, useState } from "react";

import mapboxgl from "mapbox-gl";

const Mapbox = () => {
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "";

  const [mapState] = useState({
    lng: 8.739,
    lat: 61.448,
    zoom: 12,
  });

  const mapEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapEl.current && mapboxgl.accessToken) {
      new mapboxgl.Map({
        container: mapEl.current,
        style: "mapbox://styles/nilseng/ckiuk1uf02ykx19szgx4psp19",
        center: [mapState.lng, mapState.lat],
        zoom: mapState.zoom,
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
