import { IdToken } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { IPeak } from "../models/Peak";

export const getPeaks = async (): Promise<IPeak[]> => {
  const res = await fetch("/api/peaks");
  return res.json().catch((e) => {
    console.log(`Could not fetch peaks: ${e}`);
    return [];
  });
};

export const getPeakCount = async (): Promise<number | undefined> => {
  const res = await fetch("/api/peak-count").catch((e) => console.error(e));
  return res ? res.json() : res;
};

export const searchPeaks = async (searchTerm: string): Promise<IPeak[]> => {
  if (!searchTerm) return [];
  const res = await fetch(`/api/peaks/${searchTerm}`);
  return res.json().catch((e) => {
    console.log(`Search peaks failed: ${e}`);
    return [];
  });
};

export const savePeak = async (token: IdToken, peak: IPeak): Promise<IPeak> => {
  const res = await fetch("/api/peak", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.__raw}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(peak),
  });
  return res.json().catch((e) => {
    console.log(`Could not save peak: ${e}`);
    return null;
  });
};

export const usePeakCount = () => {
  const [count, setCount] = useState<number>();

  useEffect(() => {
    getPeakCount().then((res) => setCount(res));
  }, []);

  return count;
};
