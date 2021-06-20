import React from "react";
import Container from "react-bootstrap/Container";
import { ITrip } from "../models/Trip";
import { useScroll } from "../utils/useScroll";
import useWindowDimensions from "../utils/useWindowDimensions";
import TripCard from "./TripCard";

interface IProps {
  trips?: ITrip[];
  setOffset: Function;
  setTrip: Function;
  setShowModal: Function;
}

const Feed = ({ trips, setOffset, setTrip, setShowModal }: IProps) => {
  const { height } = useWindowDimensions();

  useScroll(() => setOffset(trips ? trips.length : 0), height);

  return (
    <Container className="text-light py-4">
      {trips &&
        trips.map((trip: any) => (
          <TripCard
            key={trip._id}
            trip={trip}
            setTripToEdit={setTrip}
            setShowModal={setShowModal}
          />
        ))}
    </Container>
  );
};

export default Feed;
