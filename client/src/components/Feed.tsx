import { Dispatch, SetStateAction } from "react";
import Container from "react-bootstrap/Container";
import { ITrip } from "../models/Trip";
import { useScroll } from "../utils/useScroll";
import useWindowDimensions from "../utils/useWindowDimensions";
import Loading from "./Loading";
import TripCard from "./TripCard";

interface IProps {
  trips?: ITrip[];
  setOffset: Dispatch<SetStateAction<number>>;
  setTrip: Dispatch<SetStateAction<ITrip>>;
  setShowModal: Dispatch<SetStateAction<boolean>>;
  loading?: boolean;
}

const Feed = ({ trips, setOffset, setTrip, setShowModal, loading }: IProps) => {
  const { height } = useWindowDimensions();

  useScroll(() => setOffset(trips ? trips.length : 0), height);

  return (
    <Container className="text-light py-4">
      <>
        {trips &&
          trips.map((trip: any) => (
            <TripCard key={trip._id} trip={trip} setTripToEdit={setTrip} setShowModal={setShowModal} />
          ))}
        {loading && <Loading backgroundColor="transparent" />}
      </>
    </Container>
  );
};

export default Feed;
