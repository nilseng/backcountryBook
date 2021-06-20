import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Loading from "./Loading";
import { getUser } from "../services/userService";
import Feed from "./Feed";
import { ITrip } from "../models/Trip";
import { useGetTrips } from "../services/tripService";

interface IProps {
  trips: ITrip[];
  setTrip: any;
  setShowModal: any;
}

const Profile = ({ trips, setTrip, setShowModal }: IProps) => {
  const { isLoading, user } = useAuth0();
  const [mergedUser, setMergedUser] = useState<any>();
  const [userTrips, setUserTrips] = useState<ITrip[]>();
  const [limit] = useState<number>(3);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    if (user?.sub) {
      getUser(user.sub)
        .then((res) => setMergedUser({ ...res, user }))
        .catch((e) => setMergedUser(user));
    }
  }, [user]);

  useGetTrips(setUserTrips, limit, offset, user?.sub);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <div className="text-light">Something went wrong...</div>;
  }

  return (
    <Row className="py-2 m-0">
      {mergedUser && (
        <Col xs={6} sm={2} lg={2} className="mt-sm-5">
          <img src={mergedUser.picture} className="w-100 " alt="User" />
          <p className="text-light text-break m-0 mt-2">{mergedUser.name}</p>
          {mergedUser.level && (
            <p className="text-muted small">{mergedUser.level}</p>
          )}
        </Col>
      )}
      <Col sm={10} lg={6} className="p-0">
        {userTrips && (
          <Feed
            setOffset={setOffset}
            trips={userTrips}
            setTrip={setTrip}
            setShowModal={setShowModal}
          />
        )}
      </Col>
      <Col sm={2} lg={4} className="mt-sm-5 d-none d-lg-block">
        <div
          className="bg-dark d-flex flex-column align-items-center rounded p-4"
          style={{ maxWidth: "15rem" }}
        >
          <p className="text-light" style={{ fontSize: "3rem" }}>
            {userTrips?.length || 0}
          </p>
          <h6 className="text-light small">Trips</h6>
        </div>
      </Col>
    </Row>
  );
};

export default Profile;
