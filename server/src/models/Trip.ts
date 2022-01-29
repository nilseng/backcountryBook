import { IPeak } from "./Peak";
import { IUser } from "./User";

export interface ITrip {
  _id?: string;
  name: string;
  description?: string;
  peakIds?: string[];
  peaks?: IPeak[];
  imageIds: string[];
  tripDate?: number;
  createdAt?: number;
  updatedAt?: number;
  sub?: string;
  user?: IUser;
  routeId?: string | null;
  likes?: number;
  likedByUsers?: string[];
  comments?: IComment[];
}

export interface IComment {
  text: string;
  sub?: string;
  user?: IUser;
  createdAt?: number;
}
