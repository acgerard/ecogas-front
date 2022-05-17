import {AxiosResponse} from "axios";
import {http} from "./axios-config";

export type User = {
    id: number
    email: string
    name: string
    profile: UserProfile
}

export enum UserProfile {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER',
    STATION = 'STATION'
}

export type UserWithStations = {
    stations: number[]
} & User

export async function getUsers(): Promise<AxiosResponse<UserWithStations[]>> {
    return await http.get(`/users`)
}

export async function createUser(email: string, name: string, password: string, profile: string): Promise<AxiosResponse<User>> {
    return await http.post(`/users`, {email, name, password, profile})
}

export async function updateUser(id: number, email: string, name: string, password: string, profile: string): Promise<AxiosResponse<User>> {
    return await http.put(`/users/${id}`, {email, name, password, profile})
}

export async function createUserStation(stationId: number, userId: number) {
    return await http.post(`/users/${userId}/stations/${stationId}`)
}

export async function deleteUserStation(stationId: number, userId: number) {
    return await http.delete(`/users/${userId}/stations/${stationId}`)
}