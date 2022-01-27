import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { faMountain, faPen, faHeart as fullHeart, faCrown } from "@fortawesome/free-solid-svg-icons";
import { faComments, faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";

import { IComment, ITrip } from "../models/Trip";
import "../styles/Card.scss";
import { useRoute } from "../services/routeService";
import Peakmap from "./Peakmap";
import { debounce } from "lodash";
import { likeTrip } from "../services/tripService";
import { ErrorBoundary } from "./ErrorBoundary";
import { formatDate } from "../utils/dateFunctions";
import { TripComments } from "./TripComments";
import { TripImages } from "./TripImages";

interface IProps {
  trip: ITrip;
  setTripToEdit: any;
  setShowModal: any;
}

const TripCard = ({ trip, setTripToEdit, setShowModal }: IProps) => {
  const { user, loginWithRedirect, getIdTokenClaims } = useAuth0();

  const history = useHistory();

  const onEdit = () => {
    setTripToEdit(trip);
    setShowModal(true);
  };

  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<IComment[]>();

  const [likes, setLikes] = useState<number>(0);
  const unsavedLikes = useRef<number>(0);
  const debouncedLikeTrip = useRef(debounce(likeTrip, 250, { leading: false }));

  const like = async () => {
    if (trip._id && user) {
      setLikes((likes) => ++likes);
      unsavedLikes.current = unsavedLikes.current + 1;
      const token = await getIdTokenClaims();
      debouncedLikeTrip.current(trip._id, unsavedLikes, token);
    }
    if (!user) loginWithRedirect({ screen_hint: "signup" });
  };

  const { route, bounds } = useRoute(trip.routeId);

  return (
    <Card className="card my-1" bg="dark">
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
                {trip.user.level === "Founder" && <FaIcon icon={faCrown} className="text-warning ml-2" />}
              </span>
            )}
          </div>
          {user && user.sub === trip.sub && (
            <Button variant="link" onClick={onEdit}>
              <FaIcon icon={faPen} className="text-muted"></FaIcon>
            </Button>
          )}
        </div>
        {trip.name && <Card.Title className="mb-0">{trip.name}</Card.Title>}
      </div>
      <TripImages trip={trip} />
      {trip?.routeId && (
        <div style={{ height: "20rem" }}>
          {route && (
            <div style={{ cursor: "pointer" }} onClick={() => history.push(`/peaks?routeId=${trip.routeId}`)}>
              <ErrorBoundary {...{ message: "Could not load map... :(" }}>
                <Peakmap route={route} height="20rem" width="auto" bounds={bounds} _3d={false} interactive={false} />
              </ErrorBoundary>
            </div>
          )}
        </div>
      )}
      {trip.peaks &&
        trip.peaks.map((peak, i) => (
          <div
            key={i}
            className="my-1"
            style={{ cursor: "pointer" }}
            onClick={() => history.push(`/peaks?peakId=${peak._id}`)}
          >
            <FaIcon icon={faMountain} className="ml-1" />
            <span className="small ml-1">{peak.name}</span>
            <span className="small ml-1">{peak.height?.toLocaleString()}m</span>
          </div>
        ))}
      {trip.description && <pre className="p text-light mt-2 ml-1 mb-0">{trip.description}</pre>}
      <span className="w-100 d-flex justify-content-between">
        <span className="d-flex align-items-center">
          <button
            className="btn text-light"
            style={{ boxShadow: "none" }}
            onClick={() => setShowComments((val) => !val)}
          >
            <FaIcon icon={faComments} />
          </button>
          <p className="text-muted small mb-0 pr-2">{comments?.length ?? trip.comments?.length}</p>
        </span>
        <span className="d-flex align-items-center px-3">
          {likes || trip.likes ? <p className="text-muted small mb-0">{(trip.likes || 0) + likes}</p> : null}
          <Button variant="link" className="px-1" style={{ boxShadow: "none" }}>
            <FaIcon
              icon={likes || (user?.sub && trip.likedByUsers?.includes(user?.sub)) ? fullHeart : emptyHeart}
              style={{ cursor: "pointer" }}
              onClick={like}
            />
          </Button>
        </span>
      </span>
      {showComments && <TripComments trip={trip} comments={comments} setComments={setComments} />}
    </Card>
  );
};

export default TripCard;
