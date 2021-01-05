import { IdToken } from "@auth0/auth0-react";

import { ITrip } from "../models/Trip";

export const saveTrip = async (token: IdToken, trip: ITrip): Promise<ITrip> => {
    if (trip.peaks) delete trip.peaks
    if (trip.user) delete trip.user
    const res = await fetch("/api/trip", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token.__raw}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(trip)
    })
    return res.json()
}

export const deleteTrip = async (token: IdToken, trip: ITrip) => {
    const res = await fetch(`/api/trip`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token.__raw}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(trip)
    })
    return res.json()
}