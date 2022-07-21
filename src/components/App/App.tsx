import {logout} from "../../store/authentication";
import React, {useEffect, useState} from "react";
import {addErrorInterceptor} from "../../api/signIn";
import {useAppDispatch} from "../../app/hooks";
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {SignIn} from "../SignIn/SignIn";
import {Home} from "../Home/Home";
import {Diesel} from "../Diesel/Diesel";
import {Ecogas} from "../Ecogas/Ecogas";
import {Layout} from "./Layout";
import {StationList} from "../Station/StationList";
import {UserList} from "../User/UserList";

export function App() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    // ready when error interceptor is added
    const [ready, setReady] = useState(false)

    useEffect(() => {
        addErrorInterceptor(() => {
            dispatch(logout())
            navigate('/login')
        })
        setReady(true)
    }, [dispatch, navigate])


    return ready ? <Routes>
        <Route path="/login" element={<SignIn/>}/>
        <Route path="/" element={<Layout/>}>
            <Route path="home" element={<Home/>}/>
            <Route path="diesel" element={<Diesel/>}/>
            <Route path="ecogas" element={<Ecogas/>}/>
            <Route path="stations" element={<StationList/>}/>
            <Route path="users" element={<UserList/>}/>
            <Route
                path=""
                element={<Navigate to="/home" replace/>}
            />
        </Route>
        <Route
            path="*"
            element={<Navigate to="/home" replace/>}
        />
    </Routes> : null
}