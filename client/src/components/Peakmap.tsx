import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { LngLatBoundsLike } from "mapbox-gl";

import { IPeak } from "../models/Peak";
import Map3DControl from "../utils/Map3DControl";
import { useAuth0 } from "@auth0/auth0-react";

// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass =
  // @ts-ignore
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

interface IProps {
  setPeak?: any;
  peaks?: IPeak[];
  defaultPeak?: IPeak;
  setShowModal?: any;
  focusPeak?: IPeak;
  route?: GeoJSON.FeatureCollection;
  height?: string;
  width?: string;
  bounds?: LngLatBoundsLike;
  _3d?: boolean;
  noZoom?: boolean;
  interactive?: boolean;
  visible?: boolean;
  hasGeoLocationControl?: boolean;
}

const tileQueryUrl = "https://api.mapbox.com/v4/mapbox.mapbox-terrain-v2/tilequery";

const defaultHeight = "calc(100vh - 58px)";
const defaultWidth = "vw-100";

const Peakmap = ({
  setPeak,
  peaks,
  defaultPeak,
  setShowModal,
  focusPeak,
  route,
  height,
  width,
  bounds,
  _3d,
  noZoom,
  interactive = true,
  visible = true,
  hasGeoLocationControl,
}: IProps) => {
  const { isAuthenticated } = useAuth0();

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN || "";

  const mapEl = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map>();

  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const _3DControl = useRef<Map3DControl>(new Map3DControl());
  const geoLocateControl = useRef<mapboxgl.GeolocateControl>(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
    })
  );

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

  const getElevation = async (e: mapboxgl.MapMouseEvent & mapboxgl.EventData) => {
    const res = await fetch(
      `${tileQueryUrl}/${e.lngLat.lng},${e.lngLat.lat}.json?layers=contour&limit=50&access_token=${mapboxgl.accessToken}`
    );
    const data = await res.json();
    const elevationArray = data.features.map((feature: { geometry: any; properties: any }) => feature.properties.ele);
    return Math.max(...elevationArray);
  };

  useEffect(() => {
    if (mapEl.current && mapboxgl.accessToken) {
      setMap(
        new mapboxgl.Map({
          container: mapEl.current,
          style: "mapbox://styles/mapbox/outdoors-v11",
          zoom: 1,
          center: [0, 20],
          bounds,
          maxBounds: [-200, -85, 200, 85],
          interactive,
        })
      );
    }
    return () => setMap(undefined);
  }, [setMap, mapEl, interactive, bounds]);

  useEffect(() => {
    map?.on("load", () => {
      setIsMapLoaded(true);
    });
    return () => {
      setIsMapLoaded(false);
    };
  }, [map]);

  useEffect(() => {
    if (bounds && isMapLoaded) {
      map?.fitBounds(bounds, { duration: 0 });
    }
  }, [map, bounds, isMapLoaded]);

  // Mapbox upload API sample
  /* useEffect(() => {
    if (isMapLoaded && map) {
      map?.addSource("nilseng.8e4aa944bf794233a5e29013fb28454c", {
        type: "vector",
        url: "mapbox://nilseng.8e4aa944bf794233a5e29013fb28454c",
      });
      map?.addLayer({
        id: "nilseng.8e4aa944bf794233a5e29013fb28454c",
        type: "line",
        source: "nilseng.8e4aa944bf794233a5e29013fb28454c",
        "source-layer": "tracks",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#ff69b4",
          "line-width": 1,
        },
      });
    }
  }, [isMapLoaded, map]); */

  useEffect(() => {
    if (noZoom && isMapLoaded) map?.scrollZoom.disable();
  }, [map, noZoom, isMapLoaded]);

  useEffect(() => {
    if (map && mapEl.current) {
      _3d &&
        map.on("zoom", () => {
          if (map.getZoom() >= 10) {
            if (!map.hasControl(_3DControl.current)) {
              map.addControl(_3DControl.current);
              _3DControl.current.on("click", () => toggle3D(map));
            }
          } else {
            if (map.hasControl(_3DControl.current)) {
              map.removeControl(_3DControl.current);
            }
          }
        });
    }
  }, [mapEl, map, defaultPeak, setPeak, setShowModal, isAuthenticated, _3d]);

  useEffect(() => {
    if (map && isMapLoaded) {
      map.on("click", async (e) => {
        if (!isAuthenticated) return;
        if (e.lngLat) {
          const elevation = await getElevation(e);
          setPeak &&
            setPeak({
              ...defaultPeak,
              lngLat: e.lngLat,
              height: elevation,
            });
          setShowModal && setShowModal(true);
        }
      });
    }
    return () => {
      if (setPeak) setPeak(defaultPeak);
      if (setShowModal) setShowModal(false);
    };
  }, [map, isMapLoaded, isAuthenticated, defaultPeak, setPeak, setShowModal]);

  useEffect(() => {
    hasGeoLocationControl &&
      map &&
      !map.hasControl(geoLocateControl.current) &&
      map.addControl(geoLocateControl.current, "top-left");
  }, [isMapLoaded, hasGeoLocationControl, map]);

  useEffect(() => {
    if (map && peaks) {
      for (let peak of peaks) {
        if (peak.lngLat) new mapboxgl.Marker({ color: "#343a40" }).setLngLat(peak.lngLat).addTo(map);
      }
    }
  }, [map, peaks]);

  /*   const rotateCamera = (timestamp: number) => {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    if(map) map.rotateTo((timestamp / 100) % 360, { duration: 0 });
    // Request the next frame of the animation.
    requestAnimationFrame(rotateCamera);
    } */

  useEffect(() => {
    if (map && focusPeak && isMapLoaded) {
      if (focusPeak?.lngLat) {
        map.setZoom(14);
        map.setCenter([focusPeak.lngLat.lng, focusPeak.lngLat.lat]);
        //rotateCamera(0)
      }
    }
  }, [map, isMapLoaded, focusPeak]);

  useEffect(() => {
    if (route && map && isMapLoaded && map.isStyleLoaded()) {
      const source = map.getSource("route");
      if (!source) map.addSource("route", { type: "geojson", data: route });
      if (!map.getLayer("route")) {
        map.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#1c2e3f",
            "line-width": 2,
          },
        });
      }
    }
  }, [map, route, isMapLoaded]);

  return (
    <div
      ref={mapEl}
      id="map"
      style={{
        height: height ? height : defaultHeight,
        width: width ? width : defaultWidth,
        visibility: visible ? "visible" : "hidden",
      }}
    >
      {isAuthenticated && setPeak && (
        <div className="bg-dark text-light position-absolute rounded p-2 m-2 ml-5" style={{ zIndex: 999 }}>
          Click to add peak
        </div>
      )}
    </div>
  );
};

export default Peakmap;
