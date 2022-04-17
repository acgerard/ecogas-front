import {http} from "./axios-config";
import {AxiosResponse} from "axios";

export type Station = {
    id: number
    name: string
}

export async function getUserStations(): Promise<AxiosResponse<Station[]>> {
    return await http.get(`/stations`)
}

export async function createStation(stationId: number, stationName: string): Promise<AxiosResponse<Station>> {
    return await http.post(`/stations/${stationId}`, {name: stationName})
}