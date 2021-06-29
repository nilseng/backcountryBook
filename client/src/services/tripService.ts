import { IdToken } from "@auth0/auth0-react";
import { useEffect } from "react";

import { ITrip } from "../models/Trip";
import { isError } from "../utils/errorHandling";

const getTrips = async (setTrips: Function, setIsLoading?: Function, limit?: number, offset?: number, userId?: string) => {
    if (setIsLoading) setIsLoading(true)
    const res = await fetch(`/api/trips?limit=${limit}&offset=${offset}&userId=${userId ?? ''}`).catch(e => ({ error: e }))
    if (isError(res)) return;
    const trips = await (res as Response).json()
    setTrips((t: ITrip[]) => t ? [...t, ...trips] : trips)
    if (setIsLoading) setTimeout(() => setIsLoading(false), 1000)
}

export const useGetTrips = (setTrips: Function, setIsLoading?: Function, limit?: number, offset?: number, userId?: string) => {
    useEffect(() => {
        getTrips(setTrips, setIsLoading, limit, offset, userId)
    }, [setTrips, setIsLoading, limit, offset, userId]);
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

export const likeTrip = async (tripId: string, likes: React.MutableRefObject<number>, token: IdToken) => {
    fetch(`/api/trip/like`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token.__raw}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tripId, likes: likes.current })
    }).catch(e => ({ error: e }))
    likes.current = 0
}