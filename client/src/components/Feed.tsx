import React from "react";
import Container from "react-bootstrap/Container";
import { ITrip } from "../models/Trip";
import TripCard from "./TripCard";

interface IProps {
  trips: ITrip[];
}

const Feed = ({ trips }: IProps) => {
  return (
    <Container className="text-light py-4">
      {trips &&
        trips.map((trip: any) => <TripCard key={trip._id} trip={trip} />)}
    </Container>
  );
};

export default Feed;
