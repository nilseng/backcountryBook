import { IUser } from "./User";

export interface IPeak {
    _id?: string
    name: string
    height?: number
    area?: string
    country?: string
    sub?: string
    user?: IUser
}