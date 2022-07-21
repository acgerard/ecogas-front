import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {addSignInInterceptor, removeInterceptor, signIn} from "../api/signIn";
import {RootState} from "../app/store";
import {UserProfile} from "../api/users";

let signInInterceptor = -1
export const signInAction = createAsyncThunk(
    'authentication/signIn',
    async ({email, password}: { email: string, password: string }) => {
        if(signInInterceptor >= 0) {
            removeInterceptor(signInInterceptor)
        }
        const response = await signIn(email, password)
        const token = window.btoa(`${email}:${password}`)
        signInInterceptor = addSignInInterceptor(token)
        return {...response.data, token};
    }
);


const initialState = {
    token: null as string | null,
    name: null as string | null,
    email: null as string | null,
    profile: null as UserProfile | null
}

export const authSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        logout(state) {
            state.token = null
            state.name = null
            state.profile = null
        }
    },
    extraReducers: builder => {
        builder.addCase(signInAction.fulfilled, (state, action) => {
            state.name = action.payload.name
            state.token = action.payload.token
            state.email = action.payload.email
            state.profile = action.payload.profile
        })
    }
})

export const {logout} = authSlice.actions
export default authSlice.reducer

export const getUserName = (state: RootState) => state.authentication.name
export const getToken = (state: RootState) => state.authentication.token
export const getProfile = (state: RootState) => state.authentication.profile
export const isAdmin = (state: RootState) => state.authentication.profile === UserProfile.ADMIN