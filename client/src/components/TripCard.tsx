import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { faMountain, faPen } from "@fortawesome/free-solid-svg-icons";

import { ITrip } from "../models/Trip";
import "../styles/Card.scss";
import { getBounds, getRoute } from "../services/routeService";
import Peakmap from "./Peakmap";
import ImagePlaceholder from "./ImagePlaceholder";

interface IProps {
  trip: ITrip;
  setTripToEdit: any;
  setShowModal: any;
}

const routeMargin = 0.002;

const TripCard = ({ trip, setTripToEdit, setShowModal }: IProps) => {
  const { user } = useAuth0();
  const history = useHistory();
  const [date, setDate] = useState<string>();
  const [route, setRoute] = useState();
  const [bounds, setBounds] = useState<[number, number, number, number]>();
  const [images, setImages] = useState<any[]>([]);

  const onEdit = () => {
    setTripToEdit(trip);
    setShowModal(true);
  };

  useEffect(() => {
    if (trip.routeId) {
      getRoute(trip.routeId).then((res) => {
        if (!res?.features) return;
        try {
          const boundsObject = getBounds(
            res?.features[0]?.geometry?.coordinates
          );
          setBounds([
            boundsObject.xMin - routeMargin,
            boundsObject.yMin - routeMargin,
            boundsObject.xMax + routeMargin,
            boundsObject.yMax + routeMargin,
          ]);
          setRoute(res);
        } catch (e) {
          console.error(
            `Failed setting route for trip w id ${trip._id} and name ${trip.name}.`
          );
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
    }
  }, [trip.imageIds]);

  useEffect(() => {
    if (trip?.tripDate) {
      setDate(
        new Date(+trip.tripDate).toLocaleString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })
      );
      return;
    }
    if (trip.createdAt) {
      setDate(
        new Date(+trip.createdAt).toLocaleString(undefined, {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })
      );
    }
  }, [trip]);

  return (
    <Card className="card my-1" bg="dark">
      <div className="p-1">
        <div className="d-flex justify-content-between">
          <div>
            {date && <p className="small mb-0">{date}</p>}
            {trip.user && <p className="small text-muted">{trip.user.name}</p>}
          </div>
          {user && user.sub === trip.sub && (
            <Button variant="link" onClick={onEdit}>
              <FaIcon icon={faPen} className="text-muted"></FaIcon>
            </Button>
          )}
        </div>
        {trip.name && <Card.Title className="mb-0">{trip.name}</Card.Title>}
      </div>
      <div className="card-image-container">
        {!images && <ImagePlaceholder />}
        {images && images.length > 0 ? (
          <Carousel
            className="h-100"
            interval={null}
            indicators={images.length > 1}
            controls={images.length > 1}
          >
            {images.map((image, i) => (
              <Carousel.Item key={i}>
                <Image
                  className="card-image rounded-0 pb-2"
                  src={image}
                  rounded
                />
              </Carousel.Item>
            ))}
          </Carousel>
        ) : null}
      </div>
      {route && (
        <div
          style={{ cursor: "pointer" }}
          onClick={() => history.push(`/peaks?routeId=${trip.routeId}`)}
        >
          <Peakmap
            route={route}
            height="20rem"
            width="auto"
            bounds={bounds}
            _3d={false}
            interactive={false}
          />
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
      {trip.description && <p className="mt-2 ml-1">{trip.description}</p>}
    </Card>
  );
};

export default TripCard;
