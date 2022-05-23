import {Paper, Typography} from "@mui/material";
import React from "react";

import './CurrentConsumption.css'

export function CurrentConsumption(props: { title: string, today: number | null, year: number | null, nbDigit: number }) {
    const precision = Math.pow(10, props.nbDigit)
    const dailyValue = props.today === null ? '?' : Math.round(props.today * precision) /precision
    const yearlyValue = props.year === null ? '?' : Math.round(props.year * precision) /precision
    return <Paper variant={'outlined'} className={'current-consumption-container'}>
        <Typography className={'current-consumption-title'} color={'primary'} variant={'h4'}>{props.title}</Typography>
        <Typography>Aujourd'hui</Typography>
        <Typography fontWeight={'bold'}>{dailyValue}</Typography>
        <Typography>Cette année</Typography>
        <Typography fontWeight={'bold'}>{yearlyValue}</Typography>
    </Paper>
}