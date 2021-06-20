import { IdToken } from "@auth0/auth0-react";
import { useEffect } from "react";

import { ITrip } from "../models/Trip";
import { isError } from "../utils/errorHandling";

const getTrips = async (setTrips: Function, limit?: number, offset?: number, userId?: string) => {
    const res = await fetch(`/api/trips?limit=${limit}&offset=${offset}&userId=${userId}`).catch(e => ({ error: e }))
    if (isError(res)) return;
    const trips = await (res as Response).json()
    setTrips((t: ITrip[]) => t ? [...t, ...trips] : trips)
}

export const useGetTrips = (setTrips: Function, limit?: number, offset?: number, userId?: string) => {
    useEffect(() => {
        getTrips(setTrips, limit, offset, userId)
    }, [setTrips, limit, offset, userId]);
}

const getTripCount = async (setTripCount: Function, userId?: string) => {
    const res = await fetch(`/api/trips?count=${true}&userId=${userId}`).catch(e => ({ error: e }))
    if (isError(res)) return;
    const count = await (res as Response).json()
    setTripCount(count)
}

export const useGetTripCount = (setTripCount: Function, userId?: string) => {
    useEffect(() => {
        getTripCount(setTripCount, userId)
    }, [setTripCount, userId])
}

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