import { useAuth0 } from "@auth0/auth0-react";
import { faCrown, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { ITrip } from "../models/Trip";
import { formatDate } from "../utils/dateFunctions";

export const TripHeading = ({ trip, onEdit }: { trip: ITrip; onEdit: () => void }) => {
  const { user } = useAuth0();
  const history = useHistory();

  return (
    <div className="p-1">
      <div className="d-flex justify-content-between">
        <div>
          {trip?.tripDate ? (
            <p className="small mb-0">{formatDate(trip.tripDate)}</p>
          ) : (
            <p className="small mb-0">{formatDate(trip.createdAt)}</p>
          )}
          {trip.user && (
            <span className="small text-muted">
              {trip.user.name}
              {trip.user.level === "Founder" && <FontAwesomeIcon icon={faCrown} className="text-warning ml-2" />}
            </span>
          )}
        </div>
        {user && user.sub === trip.sub && (
          <Button variant="link" onClick={onEdit}>
            <FontAwesomeIcon icon={faPen} className="text-muted"></FontAwesomeIcon>
          </Button>
        )}
      </div>
      {trip.name && (
        <Card.Title
          className="mb-0"
          style={{ cursor: "pointer" }}
          onClick={() => history.push(`/trip-details?tripId=${trip._id}`)}
        >
          {trip.name}
        </Card.Title>
      )}
    </div>
  );
};
