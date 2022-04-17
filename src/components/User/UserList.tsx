import React, {useEffect, useState} from 'react'
import {useAppDispatch} from "../../app/hooks";
import {ConfirmDialog} from "../common/ConfirmDialog/ConfirmDialog";
import {Box, Fab, InputLabel, MenuItem, TextField} from "@mui/material";
import {useSelector} from "react-redux";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import AddIcon from "@mui/icons-material/Add";
import {createUser, fetchUsers, getAllUsers} from "../../store/user";
import {UserProfile} from "../../api/users";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export function UserList() {
    const dispatch = useAppDispatch()
    const [openDialog, setOpenDialog] = useState(false)
    const users = useSelector(getAllUsers)

    useEffect(() => {
        dispatch(fetchUsers())
    }, [dispatch])

    return <Box>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell>Nom</TableCell>
                        <TableCell>Profil</TableCell>
                        <TableCell>Stations</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow
                            key={user.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.profile}</TableCell>
                            <TableCell>{user.stations}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Fab sx={{position: 'absolute', right: '32px', bottom: '32px'}} color="primary" aria-label="add"
             onClick={() => setOpenDialog(true)}>
            <AddIcon/>
        </Fab>
        <CreateUserDialog open={openDialog} onClose={() => setOpenDialog(false)}/>
    </Box>
}

export function CreateUserDialog({open, onClose}: { open?: boolean; onClose?: () => void }) {
    const dispatch = useAppDispatch()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [profile, setProfile] = useState<string>(UserProfile.CUSTOMER)

    useEffect(() => {
        setEmail('')
        setName('')
        setPassword('')
        setProfile(UserProfile.CUSTOMER)
    }, [open])


    const handleCreateUser = () => {
        dispatch(createUser({email, name, password, profile}))
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
        </Box>
    </ConfirmDialog>
}