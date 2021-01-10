import React from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { IPeak } from "../models/Peak";
import { savePeak } from "../services/peakService";
import { useAuth0 } from "@auth0/auth0-react";

interface IProps {
  peak: IPeak;
  setPeak: any;
  defaultPeak: IPeak;
  showModal: boolean;
  setShowModal: any;
}

const PeakModal = ({
  peak,
  setPeak,
  defaultPeak,
  showModal,
  setShowModal,
}: IProps) => {
  const { getIdTokenClaims } = useAuth0();

  const handleInputChange = (event: any) => {
    setPeak({
      ...peak,
      [event.target.name]:
        event.target.type === "number" && event.target.value
          ? +event.target.value
          : event.target.value,
    });
  };

  const onSave = async () => {
    const token = await getIdTokenClaims();
    await savePeak(token, peak);
    handleHide();
  };

  const onDelete = () => {
    console.log("delete");
    handleHide();
  };

  const handleHide = () => {
    setPeak(defaultPeak);
    setShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={handleHide}>
      <Modal.Body className="text-light">
        <Form.Group>
          <Form.Label>Peak name</Form.Label>
          <Form.Control
            name="name"
            type="text"
            value={peak.name}
            onChange={handleInputChange}
            className="small bg-secondary text-light border-dark"
          ></Form.Control>
        </Form.Group>

        {peak.lngLat && (
          <Form.Group>
            <Form.Label>Position</Form.Label>
            <Form.Text>
              Longitude: {peak.lngLat.lng}, Latitude: {peak.lngLat.lat}
            </Form.Text>
          </Form.Group>
        )}
        <Form.Group>
          <Form.Label>
            Elevation <span className="text-muted">[m]</span>
          </Form.Label>
          <Form.Control
            name="height"
            type="number"
            value={!peak.height && peak.height !== 0 ? "" : peak.height}
            onChange={handleInputChange}
            className="small bg-secondary text-light border-dark"
          ></Form.Control>
          <Form.Text className="text-muted">
            Peak elevation retrieved from the map is often inaccurate. Feel free
            to correct it:)
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="bg-dark text-light border-0">
        <Button variant="secondary" onClick={() => onDelete()}>
          Delete
          <FaIcon icon={faTrash} className="ml-1" />
        </Button>
        <Button onClick={() => onSave()}>
          Save
          <FaIcon icon={faCheck} className="ml-1" />
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PeakModal;
