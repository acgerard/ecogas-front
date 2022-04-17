import axios from 'axios'

export const http = axios.create({
    // baseURL: 'http://localhost:8066/ecogas',
    baseURL: 'https://pnaz7941.odns.fr/ecogas',
    timeout: 3000,
    headers: {
        'Content-type': 'application/json',
        Accept: 'application/json',
        Prefer: 'return=representation',
    },
})
