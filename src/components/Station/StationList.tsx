import React, {ChangeEvent, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {createStation, getStations} from "../../store/station";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {useAppDispatch} from "../../app/hooks";
import {ConfirmDialog} from "../common/ConfirmDialog/ConfirmDialog";
import {Box, Fab, TextField} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

export function StationList() {
    const [openDialog, setOpenDialog] = useState(false)
    const stations = useSelector(getStations)

    return <Box>
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell>Name</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stations.map((station) => (
                        <TableRow
                            key={station.id}
                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                        >
                            <TableCell component="th" scope="row">
                                {station.id}
                            </TableCell>
                            <TableCell>{station.name}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        <Fab sx={{position: 'absolute', right: '32px', bottom: '32px'}} color="primary" aria-label="add"
             onClick={() => setOpenDialog(true)}>
            <AddIcon/>
        </Fab>
        <CreateStationDialog open={openDialog} onClose={() => setOpenDialog(false)}/>
    </Box>
}

export function CreateStationDialog({open, onClose}: { open?: boolean; onClose?: () => void }) {
    const dispatch = useAppDispatch()
    const [id, setId] = useState<number | null>(null)
    const [name, setName] = useState('')

    useEffect(() => {
        setName('')
        setId(null)
    }, [open])


    const handleCreateStation = () => {
        if (!!id) {
            dispatch(createStation({id, name}))
        }
    }

    const updateId = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        const newId = Number(value)
        if (!isNaN(newId)) {
            setId(newId)
        }
    }

    return <ConfirmDialog
        title={'Créer station'}
        confirmLabel={'Créer'}
        open={open}
        onClose={onClose}
        onConfirm={handleCreateStation}
        disabled={id === null}
    >
        <Box sx={{display: 'grid', rowGap: '16px', marginTop: '8px'}}>
            <TextField label="Id" value={id} required={true} onChange={updateId}/>
            <TextField label="Nom" value={name} onChange={e => setName(e.target.value)}/>
        </Box>
    </ConfirmDialog>
}