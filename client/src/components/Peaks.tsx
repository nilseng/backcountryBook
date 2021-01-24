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
    getPeaks()
      .then((res) => {
        setPeaks(res);
        setIsLoadingPeaks(false);
      })
      .catch((e) => {
        setIsLoadingPeaks(false);
      });
  }, [setPeaks]);

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
        _3d={true}
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
