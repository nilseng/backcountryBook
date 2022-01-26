import { IdToken } from "@auth0/auth0-react";
import { useEffect, useState } from "react";

import { IComment, ITrip } from "../models/Trip";
import { isError } from "../utils/errorHandling";

const getTrips = async (
  setTrips: Function,
  setIsLoading?: Function,
  limit?: number,
  offset?: number,
  userId?: string
) => {
  if (setIsLoading) setIsLoading(true);
  const res = await fetch(`/api/trips?limit=${limit}&offset=${offset}&userId=${userId ?? ""}`).catch((e) => ({
    error: e,
  }));
  if (isError(res)) return;
  const trips = await (res as Response).json();
  setTrips((t: ITrip[]) => (t ? [...t, ...trips] : trips));
  if (setIsLoading) setTimeout(() => setIsLoading(false), 1000);
};

export const useGetTrips = (
  setTrips: Function,
  setIsLoading?: Function,
  limit?: number,
  offset?: number,
  userId?: string
) => {
  useEffect(() => {
    getTrips(setTrips, setIsLoading, limit, offset, userId);
  }, [setTrips, setIsLoading, limit, offset, userId]);
};

const getTripCount = async (userId?: string): Promise<number | undefined> => {
  const query = userId ? `count=${true}&userId=${userId}` : `count=${true}`;
  const res = await fetch(`/api/trips?${query}`).catch((e) => console.log(e));
  return res ? res.json() : res;
};

export const useTripCount = (userId?: string) => {
  const [count, setCount] = useState<number>();

  useEffect(() => {
    getTripCount(userId).then((res) => setCount(res));
  }, [userId]);

  return count;
};

export const saveTrip = async (token: IdToken, trip: ITrip): Promise<ITrip> => {
  if (trip.peaks) delete trip.peaks;
  if (trip.user) delete trip.user;
  const res = await fetch("/api/trip", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.__raw}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trip),
  });
  return res.json();
};

export const deleteTrip = async (token: IdToken, trip: ITrip) => {
  const res = await fetch(`/api/trip`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.__raw}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trip),
  });
  return res.json();
};

export const likeTrip = async (tripId: string, likes: React.MutableRefObject<number>, token: IdToken) => {
  fetch(`/api/trip/like`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.__raw}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tripId, likes: likes.current }),
  }).catch((e) => ({ error: e }));
  likes.current = 0;
};

export const commentTrip = async (tripId: string, comment: IComment, token: IdToken) => {
  const savedComment = await fetch(`/api/trip/comment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.__raw}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ tripId, comment }),
  }).catch((e) => console.error(e));
  return savedComment ? savedComment.json() : savedComment;
};
