import React, {useEffect, useMemo} from 'react'
import {useAppDispatch} from "../../app/hooks";
import {useSelector} from "react-redux";
import {getSelectedStationId} from "../../store/station";
import {
    fetchDailyMeasures,
    fetchMonthlyMeasures, fetchYearlyMeasures,
    getDailyMeasures,
    getMonthlyMeasures,
    getYearlyMeasures
} from "../../store/measures";
import {DateTime} from "luxon";
import {TimeLine} from "../common/TimeLine/TimeLine";

export function Ecogas() {
    const dispatch = useAppDispatch()
    const selectedStationId = useSelector(getSelectedStationId)
    const dailyMeasures = useSelector(getDailyMeasures)
    const monthlyMeasures = useSelector(getMonthlyMeasures)
    const yearlyMeasures = useSelector(getYearlyMeasures)

    useEffect(() => {
        if (!selectedStationId) return
        dispatch(fetchDailyMeasures(selectedStationId))
        dispatch(fetchMonthlyMeasures(selectedStationId))
        dispatch(fetchYearlyMeasures(selectedStationId))
    }, [dispatch, selectedStationId])


    const dailyData = useMemo(() => {
        const data = dailyMeasures.map(measure => ({
            x: DateTime.fromISO(measure.date).toISODate(),
            y: measure.v_ecogas
        }))
        return [{id: "daily", data: data}]
    }, [dailyMeasures])
    const monthlyData = useMemo(() => {
        const data = monthlyMeasures.map(measure => ({
            x: DateTime.fromISO(measure.date).toISODate(),
            y: measure.v_ecogas
        }))
        return [{id: "monthly", data: data}]
    }, [monthlyMeasures])
    const yearlyData = useMemo(() => {
        const data = yearlyMeasures.map(measure => ({
            x: DateTime.fromISO(measure.date).toISODate(),
            y: measure.v_ecogas
        }))
        return [{id: "yearly", data: data}]
    }, [yearlyMeasures])

    return <div style={{height: '500px'}}>
        <div>Volume ecogas sur le mois</div>
        <TimeLine data={dailyData} type={'day'}/>
        <div>Volume ecogas sur l'année</div>
        <TimeLine data={monthlyData} type={'month'}/>
        {yearlyMeasures.length > 1 && <>
            <div>Volume ecogas par an</div>
            <TimeLine data={yearlyData} type={'year'}/>
        </>}
    </div>
}