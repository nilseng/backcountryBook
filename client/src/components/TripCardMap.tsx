import { useHistory } from "react-router-dom";
import { ITrip } from "../models/Trip";
import { useRoute } from "../services/routeService";
import { ErrorBoundary } from "./ErrorBoundary";
import Peakmap from "./Peakmap";

export const TripCardMap = ({ trip }: { trip: ITrip }) => {
  const history = useHistory();

  const { route, bounds } = useRoute(trip.routeId);

  if (!trip.routeId) return null;

  return (
    <div style={{ height: "20rem" }}>
      {route && (
        <div style={{ cursor: "pointer" }} onClick={() => history.push(`/peaks?routeId=${trip.routeId}`)}>
          <ErrorBoundary {...{ message: "Could not load map... :(" }}>
            <Peakmap route={route} height="20rem" width="auto" bounds={bounds} _3d={false} interactive={false} />
          </ErrorBoundary>
        </div>
      )}
    </div>
  );
};
