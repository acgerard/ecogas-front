import {useAppDispatch} from "../../app/hooks";
import React, {useEffect, useState} from "react";
import {UserProfile} from "../../api/users";
import {createUser, createUserStation} from "../../store/user";
import {ConfirmDialog} from "../common/ConfirmDialog/ConfirmDialog";
import {Box, InputLabel, MenuItem, TextField} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {AnyAction} from "@reduxjs/toolkit";
import {StationPicker} from "./StationPicker";

export function CreateUserDialog({open, onClose}: { open?: boolean; onClose?: () => void }) {
    const dispatch = useAppDispatch()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [profile, setProfile] = useState<string>(UserProfile.CUSTOMER)
    const [stationsSelected, setStationsSelected] = useState<number[]>([])

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

            <StationPicker stations={stationsSelected} onChange={setStationsSelected}/>

        </Box>
    </ConfirmDialog>
}

