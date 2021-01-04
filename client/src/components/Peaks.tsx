import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { faMountain } from "@fortawesome/free-solid-svg-icons";

import { IPeak } from "../models/Peak";
import { getPeaks } from "../services/peakService";
import Loading from "./Loading";
import PeakModal from "./PeakModal";

const defaultPeak: IPeak = {
  name: "",
  height: undefined,
  country: "",
  area: "",
};

const Peaks = () => {
  const { isAuthenticated } = useAuth0();

  const [isLoadingPeaks, setIsLoadingPeaks] = useState(false);
  const [peaks, setPeaks] = useState<IPeak[]>();

  const [peak, setPeak] = useState<IPeak>(defaultPeak);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setIsLoadingPeaks(true);
    getPeaks().then((res) => {
      setPeaks(res);
      setIsLoadingPeaks(false);
    });
  }, [setPeaks]);

  if (isLoadingPeaks) return <Loading />;

  return (
    <>
      <Container>
        {isAuthenticated && (
          <Button size="sm" className="mt-4" onClick={() => setShowModal(true)}>
            <FaIcon icon={faMountain} className="mr-2" />
            Add peak
          </Button>
        )}
        {peaks
          ? peaks.map((peak) => (
              <Card key={peak._id} className="text-light p-2 my-2" bg="dark">
                <Row>
                  <Col sm="6">
                    <p className="h6">{peak.name}</p>
                  </Col>
                  <Col sm="6">
                    <p className="text-muted ml-2 m-0">{peak.height}m</p>
                  </Col>
                </Row>
              </Card>
            ))
          : null}
      </Container>
      <PeakModal
        peak={peak}
        setPeak={setPeak}
        defaultPeak={defaultPeak}
        showModal={showModal}
        setShowModal={setShowModal}
      />
    </>
  );
};

export default Peaks;
