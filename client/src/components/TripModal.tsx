import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Carousel from "react-bootstrap/Carousel";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";
import { useAuth0 } from "@auth0/auth0-react";

import ImagePlaceholder from "./ImagePlaceholder";
import { ITrip } from "../models/Trip";

import "../styles/TripModal.scss";

const defaultTrip = {
  name: "Topptur",
  description: "",
  imageIds: [],
};

interface IProps {
  tripToEdit?: ITrip;
  showModal: any;
  setShowModal: any;
}

const TripModal = ({ tripToEdit, showModal, setShowModal }: IProps) => {
  const { isLoading, getIdTokenClaims, user } = useAuth0();

  const [trip, setTrip] = useState<ITrip | undefined>(
    tripToEdit ? tripToEdit : undefined
  );
  const [files, setFiles] = useState<any[]>([]);

  const onSave = async () => {
    if (trip) {
      await saveImages();
      console.log("implement save trip");
    }
    handleClose();
  };

  const onDiscard = async () => {
    if (trip?._id) console.log("delete trip");
    handleClose();
  };

  const handleClose = () => {
    setTrip(undefined);
    setShowModal(false);
    setFiles([]);
  };

  const handleImageChange = (files: any[]) => {
    setFiles(Array.from(files));
  };

  const saveImages = async () => {
    const formData = new FormData();
    if (trip && files) {
      for (const image of Array.from(files)) {
        formData.append("images", image);
        const imageId = uuid();
        trip.imageIds = [...trip.imageIds, imageId];
        formData.append("imageIds", imageId);
      }
      const token = await getIdTokenClaims();
      if (token) {
        await fetch("/s3/image", {
          headers: {
            authorization: `Bearer ${token.__raw}`,
          },
          method: "POST",
          body: formData,
        });
      }
    }
  };

  useEffect(() => {
    if (!trip && showModal && user) {
      setTrip({ _id: uuid(), sub: user.sub, ...defaultTrip });
    }
  }, [trip, showModal, user]);

  if (isLoading) return null;

  return showModal && trip ? (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header>
        <Modal.Title className="w-100">
          <Form.Group>
            <Form.Label>Navn på turen</Form.Label>
            <Form.Control
              value={trip.name}
              onChange={(e) => setTrip({ ...trip, name: e.target.value })}
            ></Form.Control>
          </Form.Group>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="image-container">
          {files?.length > 0 && (
            <Carousel className="h-100">
              {files.map((file) => (
                <Carousel.Item key={file.name}>
                  <Image
                    className="preview-image"
                    src={URL.createObjectURL(file)}
                    rounded
                  />
                  <Carousel.Caption>
                    <p>{files.length} bilde(r) er valgt.</p>
                  </Carousel.Caption>
                </Carousel.Item>
              ))}
            </Carousel>
          )}
          {(!files || files?.length === 0) && (
            <ImagePlaceholder text={"Ingen bilder er valgt."} />
          )}
        </div>
        <Form.Group className="mt-2">
          <Form.File custom>
            <Form.File.Input
              multiple
              accept="image/*"
              onChange={(e: any) => handleImageChange(e.target.files)}
            />
            <Form.File.Label data-browse="Velg bilder">
              Last opp bilder fra turen!
            </Form.File.Label>
          </Form.File>
        </Form.Group>
        <Form.Group>
          <Form.Label>Beskrivelse</Form.Label>
          <Form.Control
            value={trip.description}
            onChange={(e) => setTrip({ ...trip, description: e.target.value })}
            placeholder="Hvordan var turen?"
            as="textarea"
            rows={3}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onDiscard()}>
          Forkast
          <FaIcon icon={faTrash} className="ml-1" />
        </Button>
        <Button onClick={() => onSave()}>
          Lagre
          <FaIcon icon={faCheck} className="ml-1" />
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};

export default TripModal;
