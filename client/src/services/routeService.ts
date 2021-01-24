import { IdToken } from "@auth0/auth0-react"
import { v4 as uuid } from "uuid";

export const getRoute = async (id: string) => {
    const res = await fetch(`/api/route/${id}`)
    return res.json().catch(e => {
        console.log(`Could not fetch route: ${e}`)
        return undefined
    })
}

export const saveRoute = async (token: IdToken, geojson: any) => {
    const geojsonId = uuid()
    await fetch(`/api/route`, {
        headers: {
            authorization: `Bearer ${token.__raw}`,
            'Content-Type': 'application/json',
        },
        method: "POST",
        body: JSON.stringify({ geojsonId, geojson }),
    });
    return geojsonId;
}

export const gpxToGeojson = async (token: IdToken, gpx: any) => {
    const formData = new FormData()
    formData.append("gpx", gpx)
    const geojson = await fetch(`/api/route/gpxtogeojson`, {
        headers: {
            authorization: `Bearer ${token.__raw}`,
        },
        method: "POST",
        body: formData,
    })
    return geojson.json()
}

export const getBounds = (coordinates: [number, number, number][]) => {
    let bounds: { xMin: number, xMax: number, yMin: number, yMax: number }, longitude: number, latitude: number
    bounds = { xMin: coordinates[0][0], xMax: coordinates[0][0], yMin: coordinates[0][1], yMax: coordinates[0][1] }

    for (var i = 0; i < coordinates.length; i++) {
        longitude = coordinates[i][0];
        latitude = coordinates[i][1];

        // Update the bounds recursively by comparing the current xMin/xMax and yMin/yMax with the current coordinate
        bounds.xMin = bounds.xMin < longitude ? bounds.xMin : longitude;
        bounds.xMax = bounds.xMax > longitude ? bounds.xMax : longitude;
        bounds.yMin = bounds.yMin < latitude ? bounds.yMin : latitude;
        bounds.yMax = bounds.yMax > latitude ? bounds.yMax : latitude;
    }
    return bounds
}