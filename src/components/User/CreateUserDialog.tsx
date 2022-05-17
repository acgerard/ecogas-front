import {useAppDispatch} from "../../app/hooks";
import React, {useEffect, useState} from "react";
import {UserProfile} from "../../api/users";
import {createUser, createUserStation} from "../../store/user";
import {ConfirmDialog} from "../common/ConfirmDialog/ConfirmDialog";
import {
    Box,
    Checkbox,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    SelectChangeEvent,
    TextField
} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {useSelector} from "react-redux";
import {getStations} from "../../store/station";
import {AnyAction} from "@reduxjs/toolkit";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export function CreateUserDialog({open, onClose}: { open?: boolean; onClose?: () => void }) {
    const dispatch = useAppDispatch()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [profile, setProfile] = useState<string>(UserProfile.CUSTOMER)
    const [stationsSelected, setStationsSelected] = useState<number[]>([])
    const stations = useSelector(getStations)

    useEffect(() => {
        setEmail('')
        setName('')
        setPassword('')
        setProfile(UserProfile.CUSTOMER)
    }, [open])


    const handleCreateUser = () => {
        dispatch(createUser({email, name, password, profile})).then((action: AnyAction) => {
            const userId: number = action.payload.id
            stationsSelected.forEach(stationId => {
                dispatch(createUserStation({stationId, userId}))
            })
        })
    }

    const handleChange = (event: SelectChangeEvent<typeof stationsSelected>) => {
        const {
            target: {value},
        } = event;
        setStationsSelected(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',').map(v => Number(v)) : value,
        );
    };


    return <ConfirmDialog
        title={'Créer user'}
        confirmLabel={'Créer'}
        open={open}
        onClose={onClose}
        onConfirm={handleCreateUser}
        disabled={email === '' || password === ''}
    >
        <Box sx={{display: 'grid', rowGap: '16px', marginTop: '8px'}}>
            <TextField label="Email" value={email} required={true} onChange={e => setEmail(e.target.value)}/>
            <TextField label="Nom" value={name} onChange={e => setName(e.target.value)}/>
            <FormControl>
                <InputLabel>Profile</InputLabel>
                <Select
                    label="Profile"
                    value={profile}
                    onChange={e => {
                        if (typeof e.target.value === 'string') {
                            setProfile(e.target.value)
                        }
                    }}
                >
                    <MenuItem value={UserProfile.CUSTOMER}>{UserProfile.CUSTOMER}</MenuItem>
                    <MenuItem value={UserProfile.ADMIN}>{UserProfile.ADMIN}</MenuItem>
                    <MenuItem value={UserProfile.STATION}>{UserProfile.STATION}</MenuItem>
                </Select>
            </FormControl>
            <TextField label="Password" required={true} value={password} onChange={e => setPassword(e.target.value)}
                       type={'password'}/>
            <FormControl>
                <InputLabel id={"create-user-station"}>Stations</InputLabel>
                <Select
                    labelId="create-user-station"
                    id="create-user-station-checkbox"
                    multiple
                    value={stationsSelected}
                    onChange={handleChange}
                    input={<OutlinedInput label="Stations"/>}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                >
                    {stations.map((station) => (
                        <MenuItem key={station.id} value={station.id}>
                            <Checkbox checked={stationsSelected.indexOf(station.id) > -1}/>
                            <ListItemText primary={station.name}/>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

        </Box>
    </ConfirmDialog>
}