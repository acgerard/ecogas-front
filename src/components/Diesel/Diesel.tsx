import React, {useEffect, useMemo} from 'react'
import {useAppDispatch} from "../../app/hooks";
import {
    fetchDailyMeasures,
    fetchMonthlyMeasures,
    fetchYearlyMeasures,
    getDailyMeasures,
    getMonthlyMeasures, getYearlyMeasures
} from "../../store/measures";
import {useSelector} from "react-redux";
import {getSelectedStationId} from "../../store/station";
import {DateTime} from 'luxon';
import {TimeLine} from "../common/TimeLine/TimeLine";

export function Diesel() {
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
            y: measure.v_diesel
        }))
        return [{id: "daily", data: data}]
    }, [dailyMeasures])
    const monthlyData = useMemo(() => {
        const data = monthlyMeasures.map(measure => ({
            x: DateTime.fromISO(measure.date).toISODate(),
            y: measure.v_diesel
        }))
        return [{id: "monthly", data: data}]
    }, [monthlyMeasures])
    const yearlyData = useMemo(() => {
        const data = yearlyMeasures.map(measure => ({
            x: DateTime.fromISO(measure.date).toISODate(),
            y: measure.v_diesel
        }))
        return [{id: "yearly", data: data}]
    }, [yearlyMeasures])

    return <div style={{height: '500px'}}>
        <div>Volume diesel sur le mois</div>
        <TimeLine data={dailyData} type={'day'}/>
        <div>Volume diesel sur l'année</div>
        <TimeLine data={monthlyData} type={'month'}/>
        {yearlyMeasures.length > 1 && <>
            <div>Volume diesel par an</div>
            <TimeLine data={yearlyData} type={'year'}/>
        </>}
    </div>
}
