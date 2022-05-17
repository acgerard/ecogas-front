import {useAppDispatch, useAppSelector} from "../../app/hooks";
import React, {useEffect, useState} from "react";
import {UserProfile} from "../../api/users";
import {createUserStation, deleteUserStation, getUserById, updateUser} from "../../store/user";
import {ConfirmDialog} from "../common/ConfirmDialog/ConfirmDialog";
import {Box, InputLabel, MenuItem, TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {StationPicker} from "./StationPicker";


export function UpdateUserDialog({userId, onClose}: { userId: number, onClose?: () => void }) {
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => getUserById(state, userId))
    const [email, setEmail] = useState(user?.email || '')
    const [name, setName] = useState(user?.name || '')
    const [password, setPassword] = useState('')
    const [profile, setProfile] = useState<string>(user?.profile || '')
    const [stationsSelected, setStationsSelected] = useState<number[]>(user?.stations || [])

    useEffect(() => {
        setEmail(user?.email || '')
        setName(user?.name || '')
        setPassword('')
        setProfile(user?.profile || '')
        setStationsSelected(user?.stations || [])
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
            <StationPicker stations={stationsSelected} onChange={setStationsSelected}/>

        </Box>
    </ConfirmDialog>
}