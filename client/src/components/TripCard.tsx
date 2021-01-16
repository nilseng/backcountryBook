import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { faMountain, faPen } from "@fortawesome/free-solid-svg-icons";

import { ITrip } from "../models/Trip";
import ImagePlaceholder from "./ImagePlaceholder";
import "../styles/Card.scss";

interface IProps {
  trip: ITrip;
  setTripToEdit: any;
  setShowModal: any;
}

const TripCard = ({ trip, setTripToEdit, setShowModal }: IProps) => {
  const { user } = useAuth0();
  const [date, setDate] = useState<string>();
  const [images, setImages] = useState<any[]>([]);

  const onEdit = () => {
    setTripToEdit(trip);
    setShowModal(true);
  };

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
        {images && images.length > 0 ? (
          <Carousel className="h-100">
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
        ) : (
          <ImagePlaceholder />
        )}
      </div>
      {trip.peaks &&
        trip.peaks.map((peak, i) => (
          <div key={i}>
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
