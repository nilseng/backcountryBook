import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import TripCard from "./TripCard";

const Feed = () => {
  const [trips, setTrips] = useState<[]>([]);

  useEffect(() => {
    fetch("/api/trips").then(async (res) => {
      const trips = await res.json();
      setTrips(trips);
    });
  }, []);

  return (
    <Container className="text-light py-4">
      {trips &&
        trips.map((trip: any) => <TripCard key={trip._id} trip={trip} />)}
    </Container>
  );
};

export default Feed;
