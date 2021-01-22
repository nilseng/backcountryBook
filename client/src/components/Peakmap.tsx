import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";

import { IPeak } from "../models/Peak";
import Map3DControl from "../utils/Map3DControl";
import { useAuth0 } from "@auth0/auth0-react";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

interface IProps {
  setPeak: any;
  peaks: IPeak[];
  defaultPeak: IPeak;
  setShowModal: any;
}

const tileQueryUrl =
  "https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery";

const Peakmap = ({ setPeak, peaks, defaultPeak, setShowModal }: IProps) => {
  const { isAuthenticated } = useAuth0();

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "";

  const mapEl = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map>();
  const peakMarker = useRef<mapboxgl.Marker>(
    new mapboxgl.Marker({ draggable: true })
  );
  const _3DControl = useRef<Map3DControl>(new Map3DControl());

  const toggle3D = (map: mapboxgl.Map) => {
    if (!map.getSource("mapbox-dem")) {
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
      map.setPitch(60);
    } else {
      if (map.getSource("mapbox-dem")) {
        map.setTerrain(undefined);
        map.removeSource("mapbox-dem");
      }
      if (map.getLayer("sky")) {
        map.removeLayer("sky");
      }
      map.setPitch(0);
      map.resetNorth();
    }
  };

  const getElevation = async (
    e: mapboxgl.MapMouseEvent & mapboxgl.EventData
  ) => {
    const res = await fetch(
      `${tileQueryUrl}/${e.lngLat.lng},${e.lngLat.lat}.json?layers=contour&limit=50&access_token=${mapboxgl.accessToken}`
    );
    const data = await res.json();
    const elevationArray = data.features.map(
      (feature: { geometry: any; properties: any }) => feature.properties.ele
    );
    return Math.max(...elevationArray);
  };

  useEffect(() => {
    if (mapEl.current && mapboxgl.accessToken) {
      setMap(
        new mapboxgl.Map({
          container: mapEl.current,
          style: "mapbox://styles/nilseng/ckiuk1uf02ykx19szgx4psp19",
          zoom: 1,
          maxBounds: [-200, -85, 200, 85],
        })
      );
    }
  }, [setMap, mapEl]);

  useEffect(() => {
    if (map && mapEl.current) {
      map.on("zoom", () => {
        if (map.getZoom() >= 10) {
          if (!map.hasControl(_3DControl.current)) {
            map.addControl(_3DControl.current);
            _3DControl.current.on("click", () => toggle3D(map));
          }
          //enable3D(map);
          map.on("click", async (e) => {
            if (!isAuthenticated) return;
            if (e.lngLat) {
              peakMarker.current.setLngLat(e.lngLat).addTo(map);
              const elevation = await getElevation(e);
              setPeak({ ...defaultPeak, lngLat: e.lngLat, height: elevation });
              setShowModal(true);
            }
          });
        } else {
          if (map.hasControl(_3DControl.current)) {
            map.removeControl(_3DControl.current);
          }
        }
      });
    }
  }, [mapEl, map, defaultPeak, setPeak, setShowModal, isAuthenticated]);

  useEffect(() => {
    if (map && peaks) {
      for (let peak of peaks) {
        if (peak.lngLat)
          new mapboxgl.Marker({ color: "#343a40" })
            .setLngLat(peak.lngLat)
            .addTo(map);
      }
    }
  }, [map, peaks]);

  return (
    <>
      <div
        ref={mapEl}
        id="map"
        className="vw-100"
        style={{
          height: "calc(100vh - 58px)",
        }}
      >
        {isAuthenticated && (
          <div
            className="bg-dark text-light position-absolute rounded p-2 m-2"
            style={{ zIndex: 999 }}
          >
            Zoom in and click the map to add peak
          </div>
        )}
      </div>
    </>
  );
};

export default Peakmap;
