import React, { useEffect, useState } from "react";

import { IPeak } from "../models/Peak";
import { getPeaks } from "../services/peakService";
import Loading from "./Loading";
import PeakModal from "./PeakModal";
import Peakmap from "./Peakmap";
import { useLocation } from "react-router-dom";

const defaultPeak: IPeak = {
  name: "",
  height: undefined,
};

const Peaks = () => {
  const [isLoadingPeaks, setIsLoadingPeaks] = useState(false);
  const [peaks, setPeaks] = useState<IPeak[]>();

  const [peak, setPeak] = useState<IPeak>(defaultPeak);

  const [showModal, setShowModal] = useState(false);

  const [focusPeak, setFocusPeak] = useState<IPeak>();

  useEffect(() => {
    setIsLoadingPeaks(true);
    getPeaks()
      .then((res) => {
        setPeaks(res);
        setIsLoadingPeaks(false);
      })
      .catch((e) => {
        setIsLoadingPeaks(false);
      });
  }, [setPeaks]);

  const useQuery = () => {
    return new URLSearchParams(useLocation()?.search);
  };

  const query = useQuery();
  const [peakId, setPeakId] = useState<string>();

  useEffect(() => {
    if (query) {
      const peakId = query.get("peakId");
      if (peakId) setPeakId(peakId);
    }
  }, [query, peakId]);

  useEffect(() => {
    if (peakId && peaks) {
      const p = peaks.find((p) => p._id === peakId);
      setFocusPeak(p);
    }
  }, [peakId, peaks]);

  if (isLoadingPeaks)
    return (
      <div className="bg-dark vh-100">
        <Loading />
      </div>
    );

  return peaks ? (
    <>
      <Peakmap
        setPeak={setPeak}
        peaks={peaks}
        defaultPeak={defaultPeak}
        setShowModal={setShowModal}
        focusPeak={focusPeak}
        _3d={true}
        hasGeoLocationControl={true}
      />
      <PeakModal
        peak={peak}
        setPeak={setPeak}
        defaultPeak={defaultPeak}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  ) : null;
};

export default Peaks;
