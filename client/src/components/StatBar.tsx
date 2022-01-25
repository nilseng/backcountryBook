import { faUser, faImage } from "@fortawesome/free-regular-svg-icons";
import { faMountain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePeakCount } from "../services/peakService";
import { useTripCount } from "../services/tripService";
import { useUserCount } from "../services/userService";

export const StatBar = () => {
  const userCount = useUserCount();
  const tripCount = useTripCount();
  const peakCount = usePeakCount();

  return (
    <div className="row fixed-bottom">
      <div className="bcb-bg-transparent text-light col d-flex justify-content-around p-sm-3 p-2">
        <span className="d-flex flex-column align-items-center">
          <p className="font-weight-bold mb-1">{userCount}</p>
          <p className="small m-0">
            <FontAwesomeIcon icon={faUser} /> users
          </p>
        </span>
        <span className="d-flex flex-column align-items-center">
          <p className="font-weight-bold mb-1">{tripCount}</p>
          <p className="small m-0">
            <FontAwesomeIcon icon={faImage} /> activities
          </p>
        </span>
        <span className="d-flex flex-column align-items-center">
          <p className="font-weight-bold mb-1">{peakCount}</p>
          <p className="small m-0">
            <FontAwesomeIcon icon={faMountain} /> mountains
          </p>
        </span>
      </div>
    </div>
  );
};
