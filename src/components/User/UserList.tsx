import React, {useEffect, useState} from 'react'
import {useAppDispatch} from "../../app/hooks";
import {Box, Fab} from "@mui/material";
import {useSelector} from "react-redux";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import AddIcon from "@mui/icons-material/Add";
import {fetchUsers, getAllUsers} from "../../store/user";
import {CreateUserDialog} from "./CreateUserDialog";
import {UpdateUserDialog} from "./UpdateUserDialog";

export function UserList() {
    const dispatch = useAppDispatch()
    const [openDialog, setOpenDialog] = useState(false)
    const [userUpdate, setUserUpdate] = useState<number | null>(null)
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
                            onClick={() => setUserUpdate(user.id)}
                        >
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.profile}</TableCell>
                            <TableCell>{user.stations.join(', ')}</TableCell>
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
        {userUpdate && <UpdateUserDialog userId={userUpdate} onClose={() => setUserUpdate(null)}/>}
    </Box>
}

