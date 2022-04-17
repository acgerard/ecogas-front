import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {RootState} from "../app/store";
import {REDUX_STATUS} from "../helpers/constants";
import {getUsers, UserWithStations, createUser as createUserApi, UserProfile} from "../api/users";


export const fetchUsers = createAsyncThunk(
    'users/fetch',
    async () => {
        const response = await getUsers()
        return response.data
    }
);
export const createUser = createAsyncThunk(
    'users/create',
    async ({
               email,
               password,
               name,
               profile
           }: { email: string, password: string, name: string, profile: string }) => {
        const response = await createUserApi(email, name, password, profile)
        return response.data
    }
);

export const usersAdapter = createEntityAdapter<UserWithStations>()

const usersInitialState = usersAdapter.getInitialState({
    status: REDUX_STATUS.INIT,
})

export const usersSlice = createSlice({
    name: 'users',
    initialState: usersInitialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchUsers.pending, (state) => {
            state.status = REDUX_STATUS.FETCHING
        })
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            usersAdapter.setAll(state, action.payload)
            state.status = REDUX_STATUS.OK
        })
        builder.addCase(fetchUsers.rejected, (state) => {
            state.status = REDUX_STATUS.ERROR
        })
        builder.addCase(createUser.fulfilled, (state, action) => {
            usersAdapter.addOne(state, {...action.payload, stations: []})
        })
    }
})

export default usersSlice.reducer

export const {
    selectAll: getAllUsers,
} = usersAdapter.getSelectors((state: RootState) => state.users)
