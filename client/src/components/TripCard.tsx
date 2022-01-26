import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { faMountain, faPen, faHeart as fullHeart, faCrown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { faComments, faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";

import { IComment, ITrip } from "../models/Trip";
import "../styles/Card.scss";
import { getBounds, getRoute } from "../services/routeService";
import Peakmap from "./Peakmap";
import ImagePlaceholder from "./ImagePlaceholder";
import { debounce } from "lodash";
import { commentTrip, likeTrip } from "../services/tripService";
import { ErrorBoundary } from "./ErrorBoundary";
import { formatDate } from "../utils/dateFunctions";

interface IProps {
  trip: ITrip;
  setTripToEdit: any;
  setShowModal: any;
}

const routeMargin = 0.002;

const TripCard = ({ trip, setTripToEdit, setShowModal }: IProps) => {
  const { user, loginWithRedirect, getIdTokenClaims } = useAuth0();

  const history = useHistory();

  const [route, setRoute] = useState();
  const [bounds, setBounds] = useState<[number, number, number, number]>();
  const [images, setImages] = useState<any[]>([]);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [currentComment, setCurrentComment] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>();
  const [likes, setLikes] = useState<number>(0);
  const unsavedLikes = useRef<number>(0);
  const debouncedLikeTrip = useRef(debounce(likeTrip, 250, { leading: false }));

  const onEdit = () => {
    setTripToEdit(trip);
    setShowModal(true);
  };

  const like = async () => {
    if (trip._id && user) {
      setLikes((likes) => ++likes);
      unsavedLikes.current = unsavedLikes.current + 1;
      const token = await getIdTokenClaims();
      debouncedLikeTrip.current(trip._id, unsavedLikes, token);
    }
    if (!user) loginWithRedirect({ screen_hint: "signup" });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentComment(e.target.value);
  };

  const saveComment = async () => {
    if (!trip._id) return console.error("Trip id not defined");
    const token = await getIdTokenClaims();
    const comment: IComment = {
      text: currentComment,
    };
    const savedTrip = await commentTrip(trip._id, comment, token);
    setComments(savedTrip.comments);
    setCurrentComment("");
  };

  useEffect(() => {
    if (trip.routeId) {
      getRoute(trip.routeId).then((res) => {
        if (!res?.features || !res.features[0]?.geometry?.coordinates) return;
        try {
          const boundsObject = getBounds(res?.features[0]?.geometry?.coordinates);
          setBounds([
            boundsObject.xMin - routeMargin,
            boundsObject.yMin - routeMargin,
            boundsObject.xMax + routeMargin,
            boundsObject.yMax + routeMargin,
          ]);
          setRoute(res);
        } catch (e) {
          console.error(`Failed setting route for trip w id ${trip._id} and name ${trip.name}.`);
        }
      });
    } else {
      setRoute(undefined);
    }
  }, [trip]);

  useEffect(() => {
    if (trip.imageIds && trip.imageIds.length > 0) {
      const imgs: any[] = [];
      for (const id of trip.imageIds) {
        fetch(`/api/image/${id}`).then(async (res) => {
          const imageBlob = await res.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          const length = imgs.push(imageUrl);
          if (length === trip.imageIds.length) setImages(imgs);
        });
      }
    } else {
      setImages([]);
    }
  }, [trip.imageIds]);

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
      {trip?.imageIds?.length > 0 && (
        <div className="card-image-container">
          {(!images || images.length === 0) && <ImagePlaceholder />}
          {images && images.length > 0 ? (
            <Carousel className="h-100" interval={null} indicators={images.length > 1} controls={images.length > 1}>
              {images.map((image, i) => (
                <Carousel.Item key={i}>
                  <Image className="card-image rounded-0 pb-2" src={image} rounded />
                </Carousel.Item>
              ))}
            </Carousel>
          ) : null}
        </div>
      )}
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
        <span className="d-flex align-items-center">
          <Button variant="link" className="px-3" style={{ boxShadow: "none" }}>
            <FaIcon
              icon={likes || (user?.sub && trip.likedByUsers?.includes(user?.sub)) ? fullHeart : emptyHeart}
              style={{ cursor: "pointer" }}
              onClick={like}
            />
          </Button>
          {likes || trip.likes ? <p className="text-muted small mb-0 pr-2">{(trip.likes || 0) + likes}</p> : null}
        </span>
      </span>
      {showComments && (
        <>
          {(comments ?? trip.comments)?.map((comment, i) => (
            <div key={i} className="small px-2">
              <p className="m-0">{comment.user?.name}</p>
              <p className="text-muted m-0">{formatDate(comment.createdAt)}</p>
              <p className="pl-2 mb-2">{comment.text}</p>
            </div>
          ))}
          <div className="input-group p-2">
            <input
              className="form-control form-control-sm"
              type={"text"}
              placeholder="Comment..."
              value={currentComment}
              onChange={handleInputChange}
            ></input>
            <div className="input-group-append" onClick={saveComment}>
              <span className="input-group-text text-primary btn">
                <FaIcon icon={faCheck} />
              </span>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default TripCard;
