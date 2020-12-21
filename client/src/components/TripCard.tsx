import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";

import { ITrip } from "../models/Trip";
import ImagePlaceholder from "./ImagePlaceholder";
import "../styles/Card.scss";

interface IProps {
  trip: ITrip;
}

const TripCard = ({ trip }: IProps) => {
  const [date, setDate] = useState<string>();
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    if (trip.imageIds && trip.imageIds.length > 0) {
      for (const id of trip.imageIds) {
        fetch(`/api/image/${id}`).then(async (res) => {
          const imageBlob = await res.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          setImages((images) => [...images, imageUrl]);
        });
      }
    }
  }, [trip.imageIds]);

  useEffect(() => {
    if (trip?.createdAt) {
      setDate(
        new Date(+trip.createdAt).toLocaleString(undefined, {
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
        <div>
          {date && <p className="small mb-0">{date}</p>}
          {trip.user && <p className="small text-muted">{trip.user.name}</p>}
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
      {trip.description && <p className="text-muted">{trip.description}</p>}
    </Card>
  );
};

export default TripCard;
