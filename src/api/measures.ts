import {http} from "./axios-config";
import {AxiosResponse} from "axios";

export enum MeasureGranularity {
    SECOND = 'second',
    MINUTE = 'minute',
    HOUR = 'hour',
    DAY = 'day',
    MONTH = 'month',
    YEAR = 'year'
}

export type Measure = {
    date: number,
} & MeasureData

export type MeasureData = {
    v_diesel: number,
    v_ecogas: number,
    v_tank: number
}


export async function getMeasures(stationId: number, startTimestamp: number, granularity: MeasureGranularity): Promise<AxiosResponse<Measure[]>> {
    return await http.get(`/stations/${stationId}/measures?startdate=${startTimestamp}&granularity=${granularity}`)
}