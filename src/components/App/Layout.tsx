import {Box} from '@mui/material'
import React from 'react'
import {Outlet} from 'react-router-dom';
import {Header} from "./Header";

// TODO add error here ?
export function Layout() {
    return <Box sx={{height: '100%', width: '100%'}}>
        <Header/>
        <Box sx={{padding: '16px'}}>
            <Outlet/>
        </Box>
    </Box>
}