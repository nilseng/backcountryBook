import { IdToken } from "@auth0/auth0-react";

import { ITrip } from "../models/Trip";

export const saveTrip = async (token: IdToken, trip: ITrip): Promise<ITrip> => {
    const res = await fetch("/api/trip", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(trip)
    })
    return res.json()
}