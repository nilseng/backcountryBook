import React from "react";
import Container from "react-bootstrap/Container";
import { ITrip } from "../models/Trip";
import TripCard from "./TripCard";

interface IProps {
  trips: ITrip[];
  setTrip: any;
  setShowModal: any;
}

const Feed = ({ trips, setTrip, setShowModal }: IProps) => {
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
