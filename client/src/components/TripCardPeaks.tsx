import { faMountain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHistory } from "react-router-dom";
import { ITrip } from "../models/Trip";

export const TripCardPeaks = ({ trip }: { trip: ITrip }) => {
  const history = useHistory();

  if (!trip.peaks) return null;

  return (
    <>
      {trip.peaks.map((peak, i) => (
        <div
          key={i}
          className="my-1"
          style={{ cursor: "pointer" }}
          onClick={() => history.push(`/peaks?peakId=${peak._id}`)}
        >
          <FontAwesomeIcon icon={faMountain} className="ml-1" />
          <span className="small ml-1">{peak.name}</span>
          <span className="small ml-1">{peak.height?.toLocaleString()}m</span>
        </div>
      ))}
    </>
  );
};
