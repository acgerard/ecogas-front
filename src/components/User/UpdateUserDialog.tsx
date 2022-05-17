import {useAppDispatch, useAppSelector} from "../../app/hooks";
import React, {useEffect, useState} from "react";
import {UserProfile} from "../../api/users";
import {createUserStation, deleteUserStation, getUserById, updateUser} from "../../store/user";
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

export function UpdateUserDialog({userId, onClose}: { userId: number, onClose?: () => void }) {
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => getUserById(state, userId))
    const [email, setEmail] = useState(user?.email || '')
    const [name, setName] = useState(user?.name || '')
    const [password, setPassword] = useState('')
    const [profile, setProfile] = useState<string>(user?.profile || '')
    const [stationsSelected, setStationsSelected] = useState<number[]>(user?.stations || [])
    const stations = useSelector(getStations)

    useEffect(() => {
        setEmail(user?.email || '')
        setName(user?.name || '')
        setPassword('')
        setProfile(user?.profile || '')
    }, [user])


    const handleUpdateUser = () => {
        const stations = user?.stations || []
        dispatch(updateUser({id: userId, email, name, password, profile}))

        // create new station user
        stationsSelected.forEach(station => {
            if (!stations.includes(station)) {
                dispatch(createUserStation({stationId: station, userId}))
            }
        })
        // delete station users
        stations.forEach(station => {
            if (!stationsSelected.includes(station)) {
                dispatch(deleteUserStation({stationId: station, userId}))
            }
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
        title={'Modifier user'}
        confirmLabel={'Modifier'}
        open={true}
        onClose={onClose}
        onConfirm={handleUpdateUser}
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