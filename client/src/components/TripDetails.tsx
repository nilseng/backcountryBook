import { Dispatch, SetStateAction } from "react";
import { ITrip } from "../models/Trip";
import { useTrip } from "../services/tripService";
import { useQueryParam } from "../utils/useQuery";
import TripCard from "./TripCard";

interface IProps {
  setTripToEdit: Dispatch<SetStateAction<ITrip>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}

export const TripDetails = ({ setTripToEdit, setShowModal }: IProps) => {
  const tripId = useQueryParam("tripId");

  const trip = useTrip(tripId);

  if (!trip)
    return (
      <div className="container text-light py-4">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="container py-4">
      <TripCard trip={trip} setTripToEdit={setTripToEdit} setShowModal={setShowModal} />
    </div>
  );
};
