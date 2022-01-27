import Carousel from "react-bootstrap/Carousel";
import Image from "react-bootstrap/Image";
import { ITrip } from "../models/Trip";
import { useTripImages } from "../services/imageService";
import ImagePlaceholder from "./ImagePlaceholder";

export const TripImages = ({ trip }: { trip: ITrip }) => {
  const images = useTripImages(trip.imageIds);

  return (
    <>
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
    </>
  );
};
