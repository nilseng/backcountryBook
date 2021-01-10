import React, { useEffect, useState } from "react";

import { IPeak } from "../models/Peak";
import { getPeaks } from "../services/peakService";
import Loading from "./Loading";
import PeakModal from "./PeakModal";
import Peakmap from "./Peakmap";

const defaultPeak: IPeak = {
  name: "",
  height: undefined,
};

const Peaks = () => {
  const [isLoadingPeaks, setIsLoadingPeaks] = useState(false);
  const [peaks, setPeaks] = useState<IPeak[]>();

  const [peak, setPeak] = useState<IPeak>(defaultPeak);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsLoadingPeaks(true);
    getPeaks().then((res) => {
      setPeaks(res);
      setIsLoadingPeaks(false);
    });
  }, [setPeaks]);

  if (isLoadingPeaks) return <Loading />;

  return peaks ? (
    <>
      <Peakmap
        setPeak={setPeak}
        peaks={peaks}
        defaultPeak={defaultPeak}
        setShowModal={setShowModal}
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
