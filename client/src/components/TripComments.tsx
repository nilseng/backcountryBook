import { useAuth0 } from "@auth0/auth0-react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { IComment, ITrip } from "../models/Trip";
import { commentTrip } from "../services/tripService";
import { formatDate } from "../utils/dateFunctions";

export const TripComments = ({
  trip,
  comments,
  setComments,
}: {
  trip: ITrip;
  comments?: IComment[];
  setComments: Dispatch<SetStateAction<IComment[] | undefined>>;
}) => {
  const { user, getIdTokenClaims } = useAuth0();

  const [currentComment, setCurrentComment] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentComment(e.target.value);
  };

  const saveComment = async () => {
    if (!trip._id) return console.error("Trip id not defined");
    const token = await getIdTokenClaims();
    const comment: IComment = {
      text: currentComment,
    };
    const savedTrip = await commentTrip(trip._id, comment, token);
    setComments(savedTrip.comments);
    setCurrentComment("");
  };

  return (
    <>
      {(comments ?? trip.comments)?.map((comment, i) => (
        <div key={i} className="small px-2">
          <p className="m-0">{comment.user?.name}</p>
          <p className="text-muted m-0">{formatDate(comment.createdAt)}</p>
          <p className="pl-2 mb-2">{comment.text}</p>
        </div>
      ))}
      {user && (
        <div className="input-group p-2">
          <input
            className="form-control form-control-sm"
            type={"text"}
            placeholder="Comment..."
            value={currentComment}
            onChange={handleInputChange}
          ></input>
          <div className="input-group-append" onClick={saveComment}>
            <span className="input-group-text text-primary btn">
              <FontAwesomeIcon icon={faCheck} />
            </span>
          </div>
        </div>
      )}
    </>
  );
};
