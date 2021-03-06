import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {
    fetchTodayMeasures, fetchYearlyMeasures,
    getEcogasRemaining,
    getThisYearDiesel,
    getThisYearEcogas,
    getTodayDiesel,
    getTodayEcogas,
    getTodayStatus
} from "../../store/measures";
import {useAppDispatch} from "../../app/hooks";
import {Alert, Box, Snackbar, Typography} from "@mui/material";
import {REDUX_STATUS} from "../../helpers/constants";
import {getSelectedStationId} from "../../store/station";
import {CurrentConsumption} from "./CurrentConsumption";
import {useInterval} from "../../hooks/useInterval";

import './Home.css'

export function Home() {
    const dispatch = useAppDispatch()
    const todayStatus = useSelector(getTodayStatus)
    const [open, setOpen] = React.useState(todayStatus === REDUX_STATUS.ERROR)
    const selectedStationId = useSelector(getSelectedStationId)
    const todayDiesel = useSelector(getTodayDiesel)
    const todayEcogas = useSelector(getTodayEcogas)
    const yearDiesel = useSelector(getThisYearDiesel)
    const yearEcogas = useSelector(getThisYearEcogas)
    const remainingEcogas = useSelector(getEcogasRemaining)
    const fetchData = useCallback(() => {
        if (!!selectedStationId) {
            dispatch(fetchTodayMeasures(selectedStationId))
            dispatch(fetchYearlyMeasures(selectedStationId))
        }
    }, [dispatch, selectedStationId])

    useInterval(fetchData, 5000)

    useEffect(() => {
        if (!!selectedStationId) {
            dispatch(fetchTodayMeasures(selectedStationId))
            dispatch(fetchYearlyMeasures(selectedStationId))
        }
    }, [dispatch, selectedStationId])

    useEffect(() => {
        if (todayStatus === REDUX_STATUS.ERROR) {
            setOpen(true)
        }
    }, [todayStatus])

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };


    return <Box>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert severity="error" sx={{width: '100%'}}>
                Erreur lors de la r??cup??ration des mesures du jour.
            </Alert>
        </Snackbar>
        <div className={'home-container'}>
            <CurrentConsumption title={'Diesel'} today={todayDiesel} year={yearDiesel} nbDigit={2}/>
            <CurrentConsumption title={'Ecogas'} today={todayEcogas} year={yearEcogas} nbDigit={3}/>
            <div className={'remaining-ecogas'}>
                <Typography variant={'h4'} color={'primary'}>Ecogas restant</Typography>
                <Typography fontWeight={'bold'}>{remainingEcogas || '?'}</Typography>
            </div>
        </div>
    </Box>
}

