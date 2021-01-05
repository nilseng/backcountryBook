import { IPeak } from "./Peak";
import { IUser } from "./User";

export interface ITrip {
    _id?: string
    name: string
    description?: string
    peakIds?: string[]
    peaks?: IPeak[]
    imageIds: string[]
    createdAt?: number
    updatedAt?: number
    sub?: string
    user?: IUser
}