import Card from "react-bootstrap/Card";
import { ITrip } from "../models/Trip";
import "../styles/Card.scss";
import { TripImages } from "./TripImages";
import { TripHeading } from "./TripHeading";
import { TripCardMap } from "./TripCardMap";
import { TripCardPeaks } from "./TripCardPeaks";
import { TripCardFooter } from "./TripCardFooter";

interface IProps {
  trip: ITrip;
  setTripToEdit: any;
  setShowModal: any;
}

const TripCard = ({ trip, setTripToEdit, setShowModal }: IProps) => {
  const onEdit = () => {
    setTripToEdit(trip);
    setShowModal(true);
  };

  return (
    <Card className="card my-1" bg="dark">
      <TripHeading trip={trip} onEdit={onEdit} />
      <TripImages trip={trip} />
      <TripCardMap trip={trip} />
      <TripCardPeaks trip={trip} />
      {trip.description && <pre className="p text-light mt-2 ml-1 mb-0">{trip.description}</pre>}
      <TripCardFooter trip={trip} />
    </Card>
  );
};

export default TripCard;
