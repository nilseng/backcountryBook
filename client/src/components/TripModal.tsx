import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Carousel from "react-bootstrap/Carousel";
import ListGroup from "react-bootstrap/ListGroup";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon as FaIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuid } from "uuid";
import { IdToken, useAuth0 } from "@auth0/auth0-react";
import { debounce } from "lodash";

import ImagePlaceholder from "./ImagePlaceholder";
import { ITrip } from "../models/Trip";

import "../styles/TripModal.scss";
import { deleteTrip, saveTrip } from "../services/tripService";
import Loading from "./Loading";
import { searchPeaks } from "../services/peakService";
import { IPeak } from "../models/Peak";
import { Badge, InputGroup } from "react-bootstrap";
import { convertToDateInputFormat } from "../utils/dateFunctions";
import { getBounds, gpxToGeojson, saveRoute } from "../services/routeService";
import Peakmap from "./Peakmap";

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

  const [searchedPeaks, setSearchedPeaks] = useState<IPeak[]>([]);
  const [geojson, setGeojson] = useState<any>();
  const [bounds, setBounds] = useState<[number, number, number, number]>();
  const [files, setFiles] = useState<any[]>();
  const [isSaving, setIsSaving] = useState(false);

  const handleSearch = (e: any) => {
    const searchTerm = e.target.value;

    searchPeak(searchTerm);
  };

  const searchPeak = debounce(
    (searchTerm: string) => {
      searchPeaks(searchTerm).then((peaks) => setSearchedPeaks(peaks));
    },
    250,
    {
      leading: false,
      trailing: true,
    }
  );

  const addPeak = (peak: IPeak) => {
    setTrip((trip: ITrip) => ({
      ...trip,
      peakIds: trip.peakIds ? [...trip.peakIds, peak._id] : [peak._id],
      peaks: trip.peaks ? [...trip.peaks, peak] : [peak],
    }));
    setSearchedPeaks([]);
  };

  const removePeak = (index: number) => {
    setTrip((trip: ITrip) => {
      const peakIds = trip.peakIds ? [...trip.peakIds] : [];
      peakIds.splice(index, 1);
      const peaks = trip.peaks ? [...trip.peaks] : [];
      peaks.splice(index, 1);
      return { ...trip, peakIds, peaks };
    });
  };

  const onSave = async () => {
    setIsSaving(true);
    if (trip) {
      const token = await getIdTokenClaims();
      const routeId = await saveGeojson(token);
      const imageIds = await saveImages(token);
      const peaks = trip.peaks ? [...trip.peaks] : [];
      const savedTrip = imageIds
        ? await saveTrip(token, {
            ...trip,
            imageIds: [...trip.imageIds, ...imageIds],
            routeId,
          })
        : await saveTrip(token, { ...trip, routeId });
      setTrips((trips: ITrip[]) => [
        { ...savedTrip, user, peaks },
        ...trips.filter((t) => t._id !== savedTrip._id),
      ]);
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
    setGeojson(undefined);
    setBounds(undefined);
    setFiles(undefined);
    setSearchedPeaks([]);
  };

  const handleGpxChange = async (files: any[]) => {
    if (!files || Array.from(files)?.length === 0) return;
    const token = await getIdTokenClaims();
    const res = await gpxToGeojson(token, Array.from(files)[0]);
    setGeojson(res);
    const bounds = getBounds(res?.features[0]?.geometry?.coordinates);
    setBounds([bounds.xMin, bounds.yMin, bounds.xMax, bounds.yMax]);
  };

  const handleImageChange = (files: any[]) => {
    setFiles(Array.from(files));
  };

  const saveGeojson = async (token: IdToken) => {
    if (!(token && trip && geojson)) return;
    return await saveRoute(token, geojson);
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
    <Modal
      id="tripModal"
      show={showModal}
      onHide={handleClose}
      animation={false}
    >
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
            <Form.Row className="mb-2">
              <Col sm={8}>
                <InputGroup size="sm">
                  <InputGroup.Prepend>
                    <InputGroup.Text className="small">Date</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    size="sm"
                    type="datetime-local"
                    placeholder="yyyy-mm-ddThh:mm"
                    value={
                      trip.tripDate
                        ? convertToDateInputFormat(trip.tripDate)
                        : ""
                    }
                    onChange={(e) =>
                      setTrip({
                        ...trip,
                        tripDate: Date.parse(e.target.value),
                      })
                    }
                    className="bg-secondary text-light border-0"
                  ></Form.Control>
                </InputGroup>
              </Col>
            </Form.Row>
            <Peakmap
              route={geojson}
              height="20rem"
              width="auto"
              bounds={bounds}
              _3d={false}
            />
            <Form.Group className="mt-2">
              <Form.File custom>
                <Form.File.Input
                  accept="application/gpx+xml"
                  onChange={async (e: any) =>
                    await handleGpxChange(e.target.files)
                  }
                />
                <Form.File.Label
                  data-browse="Select GPX file"
                  className="small bg-secondary text-light border-dark"
                >
                  Upload a GPX file to see your route on the map.
                </Form.File.Label>
              </Form.File>
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
              <Form.Label>Peaks</Form.Label>
              {trip.peaks?.map((peak, i) => (
                <Badge key={i} pill variant="primary ml-1">
                  {peak.name}
                  <Button
                    size="sm"
                    className="m-0 ml-1 p-0"
                    onClick={() => removePeak(i)}
                  >
                    <FaIcon icon={faTimes} className="m-0" />
                  </Button>
                </Badge>
              ))}
              <Form.Control
                name="peakSearchTerm"
                type="text"
                placeholder="Search peaks..."
                size="sm"
                className="bg-secondary text-light border-0"
                onChange={(e) => handleSearch(e)}
              ></Form.Control>
              <ListGroup>
                {searchedPeaks?.map((peak) => (
                  <ListGroup.Item
                    key={peak._id}
                    className="bg-secondary small py-0"
                  >
                    <Button variant="secondary" onClick={() => addPeak(peak)}>
                      {peak.name}
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
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
