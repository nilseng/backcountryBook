import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Carousel from "react-bootstrap/Carousel";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";
import { IdToken, useAuth0 } from "@auth0/auth0-react";

import ImagePlaceholder from "./ImagePlaceholder";
import { ITrip } from "../models/Trip";

import "../styles/TripModal.scss";
import { deleteTrip, saveTrip } from "../services/tripService";
import Loading from "./Loading";

interface IProps {
  trip: ITrip;
  setTrip: any;
  defaultTrip: ITrip;
  tripToEdit?: ITrip;
  showModal: any;
  setShowModal: any;
  setTrips: any;
}

const TripModal = ({
  trip,
  setTrip,
  defaultTrip,
  showModal,
  setShowModal,
  setTrips,
}: IProps) => {
  const { isLoading, user, getIdTokenClaims } = useAuth0();

  const [files, setFiles] = useState<any[]>();

  const [isSaving, setIsSaving] = useState(false);

  const onSave = async () => {
    setIsSaving(true);
    if (trip) {
      const token = await getIdTokenClaims();
      try {
        const imageIds = await saveImages(token);
        const savedTrip = imageIds
          ? await saveTrip(token, {
              ...trip,
              imageIds: [...trip.imageIds, ...imageIds],
            })
          : await saveTrip(token, trip);
        setTrips((trips: ITrip[]) => [
          { ...savedTrip, user },
          ...trips.filter((t) => t._id !== savedTrip._id),
        ]);
      } catch (e) {
        console.log(`Something went wrong: ${e}`);
      }
    }
    setIsSaving(false);
    handleClose();
  };

  const onDiscard = async () => {
    const token = await getIdTokenClaims();
    if (trip?._id) {
      try {
        await deleteTrip(token, trip);
        setTrips((trips: ITrip[]) => trips.filter((t) => t._id !== trip._id));
      } catch (e) {
        console.log(`Something went wrong: ${e}`);
      }
    }
    handleClose();
  };

  const handleClose = () => {
    setTrip(defaultTrip);
    setShowModal(false);
    setFiles(undefined);
  };

  const handleImageChange = (files: any[]) => {
    setFiles(Array.from(files));
  };

  const saveImages = async (token: IdToken) => {
    if (!(token && trip && files)) return;
    const formData = new FormData();
    const imageIds = [];
    for (const image of Array.from(files)) {
      formData.append("images", image);
      const imageId = uuid();
      imageIds.push(imageId);
      formData.append("imageIds", imageId);
    }
    await fetch("/api/image", {
      headers: {
        authorization: `Bearer ${token.__raw}`,
      },
      method: "POST",
      body: formData,
    });
    return imageIds;
  };

  if (isLoading) return null;

  return showModal && trip ? (
    <Modal show={showModal} onHide={handleClose}>
      {isSaving && <Loading text={"Saving trip..."} height={"47rem"} />}
      {!isSaving && (
        <>
          <Modal.Body className="bg-dark text-light">
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                size="sm"
                value={trip.name}
                onChange={(e) => setTrip({ ...trip, name: e.target.value })}
                className="bg-secondary text-light border-0"
              ></Form.Control>
            </Form.Group>
            <div className="image-container">
              {files && files.length > 0 && (
                <Carousel className="h-100">
                  {files.map((file) => (
                    <Carousel.Item key={file.name}>
                      <Image
                        className="preview-image"
                        src={URL.createObjectURL(file)}
                        rounded
                      />
                      <Carousel.Caption>
                        <p>{files.length} image(s) selected.</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
              )}
              {(!files || files?.length === 0) && (
                <ImagePlaceholder text={"No images selected."} />
              )}
            </div>
            <Form.Group className="mt-2">
              <Form.File custom>
                <Form.File.Input
                  multiple
                  accept="image/*"
                  onChange={(e: any) => handleImageChange(e.target.files)}
                />
                <Form.File.Label
                  data-browse="Select images"
                  className="small bg-secondary text-light border-dark"
                >
                  Upload images from the trip!
                </Form.File.Label>
              </Form.File>
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                value={trip.description}
                onChange={(e) =>
                  setTrip({ ...trip, description: e.target.value })
                }
                placeholder="How was the trip?"
                as="textarea"
                rows={3}
                className="small bg-secondary text-light border-dark"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-dark text-light border-0">
            <Button variant="secondary" onClick={() => onDiscard()}>
              Delete
              <FaIcon icon={faTrash} className="ml-1" />
            </Button>
            <Button onClick={() => onSave()}>
              Save
              <FaIcon icon={faCheck} className="ml-1" />
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  ) : null;
};

export default TripModal;
