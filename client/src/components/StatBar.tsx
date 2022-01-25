import { usePeakCount } from "../services/peakService";
import { useTripCount } from "../services/tripService";
import { useUserCount } from "../services/userService";

export const StatBar = () => {
  const userCount = useUserCount();
  const tripCount = useTripCount();
  const peakCount = usePeakCount();

  return (
    <div className="row fixed-bottom">
      <div className="bcb-bg-transparent text-light col d-flex justify-content-around p-sm-4 p-2">
        <span>
          Users: <span className="font-weight-bold m-0 ml-2">{userCount}</span>
        </span>
        <span className="ml-4">
          Activities:{" "}
          <span className="font-weight-bold m-0 ml-2">{tripCount}</span>
        </span>
        <span className="ml-4">
          Mountains:{" "}
          <span className="font-weight-bold m-0 ml-2">{peakCount}</span>
        </span>
      </div>
    </div>
  );
};
