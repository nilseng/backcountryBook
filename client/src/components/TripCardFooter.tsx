import { useAuth0 } from "@auth0/auth0-react";
import { faComments, faHeart as emptyHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { debounce } from "lodash";
import { useRef, useState } from "react";
import { Button } from "react-bootstrap";
import { IComment, ITrip } from "../models/Trip";
import { likeTrip } from "../services/tripService";
import { TripComments } from "./TripComments";

export const TripCardFooter = ({ trip }: { trip: ITrip }) => {
  const { user, loginWithRedirect, getIdTokenClaims } = useAuth0();

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

  return (
    <>
      <span className="w-100 d-flex justify-content-between">
        <span className="d-flex align-items-center">
          <button
            className="btn text-light"
            style={{ boxShadow: "none" }}
            onClick={() => setShowComments((val) => !val)}
          >
            <FontAwesomeIcon icon={faComments} />
          </button>
          <p className="text-muted small mb-0 pr-2">{comments?.length ?? trip.comments?.length}</p>
        </span>
        <span className="d-flex align-items-center px-3">
          {likes || trip.likes ? <p className="text-muted small mb-0">{(trip.likes || 0) + likes}</p> : null}
          <Button variant="link" className="px-1" style={{ boxShadow: "none" }}>
            <FontAwesomeIcon
              icon={likes || (user?.sub && trip.likedByUsers?.includes(user?.sub)) ? fullHeart : emptyHeart}
              style={{ cursor: "pointer" }}
              onClick={like}
            />
          </Button>
        </span>
      </span>
      {showComments && <TripComments trip={trip} comments={comments} setComments={setComments} />}
    </>
  );
};
