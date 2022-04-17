import {Paper, Typography} from "@mui/material";
import React from "react";

import './CurrentConsumption.css'

export function CurrentConsumption(props: { title: string, today: number | null, year: number | null }) {
    return <Paper variant={'outlined'} className={'current-consumption-container'}>
        <Typography className={'current-consumption-title'} color={'primary'} variant={'h4'}>{props.title}</Typography>
        <Typography>Aujourd'hui</Typography>
        <Typography fontWeight={'bold'}>{props.today || '?'}</Typography>
        <Typography>Cette année</Typography>
        <Typography fontWeight={'bold'}>{props.year || '?'}</Typography>
    </Paper>
}