import { IUser } from "./User";

export interface ITrip {
    _id?: string
    name: string
    description?: string
    summitIds?: string[]
    imageIds: string[]
    createdAt?: number
    updatedAt?: number
    sub?: string
    user?: IUser
}