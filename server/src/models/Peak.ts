import { IUser } from "./User";

export interface IPeak {
  _id?: string;
  name: string;
  lngLat?: { lng: number; lat: number };
  height?: number;
  sub?: string;
  user?: IUser;
}
