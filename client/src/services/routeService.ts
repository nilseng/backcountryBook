import { IdToken } from "@auth0/auth0-react";
import { GeoJSONSourceRaw, LngLatBoundsLike } from "mapbox-gl";
import { useEffect, useState } from "react";

const routeMargin = 0.002;

export const getRoute = async (id: string) => {
  const res = await fetch(`/api/route/${id}`);
  return res.json().catch((e) => {
    console.log(`Could not fetch route: ${e}`);
    return undefined;
  });
};

export const useRoute = (routeId?: string | null) => {
  const [route, setRoute] = useState<GeoJSONSourceRaw>();
  const [bounds, setBounds] = useState<LngLatBoundsLike>();

  useEffect(() => {
    if (routeId) {
      getRoute(routeId).then((res) => {
        if (!res?.features || !res.features[0]?.geometry?.coordinates) return;
        try {
          const boundsObject = getBounds(res?.features[0]?.geometry?.coordinates);
          setBounds([
            boundsObject.xMin - routeMargin,
            boundsObject.yMin - routeMargin,
            boundsObject.xMax + routeMargin,
            boundsObject.yMax + routeMargin,
          ]);
          setRoute(res);
        } catch (e) {
          console.error(`Failed setting route.`);
        }
      });
    } else {
      setRoute(undefined);
    }

    return () => {
      setRoute(undefined);
      setBounds(undefined);
    };
  }, [routeId]);

  return { route, bounds };
};

export const saveGeojson = async (token: IdToken, geojson: any, id: string) => {
  await fetch(`/api/route/geojson`, {
    headers: {
      authorization: `Bearer ${token.__raw}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ id, geojson }),
  });
};

export const saveGpx = async (token: IdToken, gpx: any, id: string) => {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("gpx", gpx);
  await fetch(`/api/mapbox/upload`, {
    headers: {
      authorization: `Bearer ${token.__raw}`,
    },
    method: "POST",
    body: formData,
  });
};

export const deleteRoute = async (token: IdToken, routeId: string) => {
  await fetch(`/api/route/${routeId}`, {
    headers: {
      authorization: `Bearer ${token.__raw}`,
      "Content-Type": "application/json",
    },
    method: "DELETE",
  }).catch((_) => console.error("Could not delete route."));
};

//TODO: Use upload API instead (?)
export const gpxToGeojson = async (token: IdToken, gpx: any) => {
  const formData = new FormData();
  formData.append("gpx", gpx);
  const geojson = await fetch(`/api/route/gpxtogeojson`, {
    headers: {
      authorization: `Bearer ${token.__raw}`,
    },
    method: "POST",
    body: formData,
  });
  return geojson.json();
};

export const getBounds = (coordinates: [number, number, number][]) => {
  let bounds: { xMin: number; xMax: number; yMin: number; yMax: number }, longitude: number, latitude: number;
  bounds = { xMin: coordinates[0][0], xMax: coordinates[0][0], yMin: coordinates[0][1], yMax: coordinates[0][1] };

  for (let i = 0; i < coordinates.length; i++) {
    longitude = coordinates[i][0];
    latitude = coordinates[i][1];

    // Update the bounds recursively by comparing the current xMin/xMax and yMin/yMax with the current coordinate
    bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
    bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
    bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
    bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
  }
  return bounds;
};
