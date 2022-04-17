import React, {useEffect, useState} from "react";
import {AppBar, Box, IconButton, Tab, Tabs, Toolbar, Typography} from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import {useLocation, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {fetchStations, getSelectedStation} from "../../store/station";
import {getUserName, isAdmin, logout} from "../../store/authentication";
import {useAppDispatch} from "../../app/hooks";

const HOME_PATHNAME = '/home'
const DIESEL_PATHNAME = '/diesel'
const ECOGAS_PATHNAME = '/ecogas'
const USER_PATHNAME = '/users'
const STATION_PATHNAME = '/stations'

export function Header() {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useAppDispatch()
    const [value, setValue] = useState(1)
    const [backoffice, setBackoffice] = useState(false)
    const station = useSelector(getSelectedStation)
    const username = useSelector(getUserName)
    const admin = useSelector(isAdmin)

    useEffect(() => {
        dispatch(fetchStations())
    }, [])

    useEffect(() => {
        updateValue()
    }, [location])

    const updateValue = () => {
        switch (location.pathname) {
            case HOME_PATHNAME:
                setValue(1)
                setBackoffice(false)
                break;
            case DIESEL_PATHNAME:
                setValue(2)
                setBackoffice(false)
                break;
            case ECOGAS_PATHNAME:
                setValue(3)
                setBackoffice(false)
                break;
            case USER_PATHNAME:
                setValue(4)
                setBackoffice(true)
                break;
            case STATION_PATHNAME:
                setValue(5)
                setBackoffice(true)
                break;
        }
    }


    const handleNavigate = (event: React.SyntheticEvent, newValue: number) => {
        switch (newValue) {
            case 1:
                navigate(HOME_PATHNAME)
                break
            case 2:
                navigate(DIESEL_PATHNAME)
                break
            case 3:
                navigate(ECOGAS_PATHNAME)
                break
            case 4:
                navigate(USER_PATHNAME)
                break
            case 5:
                navigate(STATION_PATHNAME)
                break

        }
    }


    const onLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    // TODO if multiple stations, put a drop down somewhere to select it

    return <>
        <AppBar position="static" color={'secondary'}>
            <Toolbar sx={{display: 'grid', gridAutoFlow: 'column', gridTemplateColumns: 'auto 1fr auto auto'}}>
                <Box sx={{width: '70px', padding: '10px'}}>
                    <img src={`${process.env.PUBLIC_URL}/ecogas-logo.svg`}/>
                </Box>
                <Typography variant="h4" sx={{
                    display: 'grid',
                    height: '100%',
                    alignItems: 'center'
                }}>{backoffice ? 'Administration' : station ? station.name || station.id : ''}</Typography>
                <Typography>{username}</Typography>
                <IconButton size="medium" color="inherit" aria-label="logout" onClick={onLogout}>
                    <ExitToAppIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
        <Tabs
            onChange={handleNavigate}
            value={value}
            aria-label="Navigation Tabs"
            sx={{marginBottom: '16px'}}
        >
            <Tab label={"Accueil"} value={1} sx={{flexGrow: '1', maxWidth: '100%'}}/>
            <Tab label={"Diesel"} value={2} sx={{flexGrow: '1', maxWidth: '100%'}}/>
            <Tab label={"Ecogas"} value={3} sx={{flexGrow: '1', maxWidth: '100%'}}/>
            {admin && <Tab label={"Users"} value={4} sx={{flexGrow: '1', maxWidth: '100%'}}/>}
            {admin && <Tab label={"Stations"} value={5} sx={{flexGrow: '1', maxWidth: '100%'}}/>}
        </Tabs>
    </>
}