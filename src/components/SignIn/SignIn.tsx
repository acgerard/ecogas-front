import React, {FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../app/hooks";
import {signInAction} from "../../store/authentication";
import {Box, Button, Paper, TextField} from "@mui/material";

import './SignIn.css'

export function SignIn() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const handleSignIn = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        dispatch(signInAction({email, password})).then(() => navigate('/home'))
        // TODO display something if error
    }

    return <form className={'sign-in'} onSubmit={handleSignIn}>
        <Paper className={'sign-in-content'}>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '120px',
                padding: '10px',
                justifyContent: 'center',
                marginBottom: '16px'
            }}>
                <img src={`${process.env.PUBLIC_URL}/ecogas-logo.svg`} alt={''}/>
            </Box>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Adresse mail"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={e => setEmail(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={e => setPassword(e.target.value)}
            />
            <Button fullWidth variant="contained" color="primary" type="submit">
                Se connecter
            </Button>
        </Paper>
    </form>
}