import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {RootState} from "../app/store";
import {REDUX_STATUS} from "../helpers/constants";
import {
    getUsers,
    UserWithStations,
    createUser as createUserApi,
    updateUser as updateUserApi,
    createUserStation as createUserStationApi,
    deleteUserStation as deleteUserStationApi,
    User
} from "../api/users";


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
           }: { email: string, password: string, name: string, profile: string }): Promise<User> => {
        const response = await createUserApi(email, name, password, profile)
        return response.data
    }
);
export const updateUser = createAsyncThunk(
    'users/update',
    async ({
               id,
               email,
               password,
               name,
               profile
           }: { id: number, email: string, password: string, name: string, profile: string }): Promise<User> => {
        const response = await updateUserApi(id, email, name, password, profile)
        return response.data
    }
);
export const createUserStation = createAsyncThunk(
    'userStation/create',
    async ({
               stationId,
               userId
           }: { stationId: number, userId: number }, {getState}: any): Promise<{ id: number, changes: { stations: number[] } }> => {
        await createUserStationApi(stationId, userId)
        const stations = getUserById(getState(), userId)?.stations || []
        return {id: userId, changes: {stations: [...stations, stationId]}}
    }
);

export const deleteUserStation = createAsyncThunk(
    'userStation/delete',
    async ({
               stationId,
               userId
           }: { stationId: number, userId: number }, {getState}: any): Promise<{ id: number, changes: { stations: number[] } }> => {
        await deleteUserStationApi(stationId, userId)
        const stations = getUserById(getState(), userId)?.stations || []
        const index = stations.indexOf(stationId)
        const newStations = [...stations].splice(index, 1)
        return {id: userId, changes: {stations: newStations}}
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
        builder.addCase(updateUser.fulfilled, (state, action) => {
            usersAdapter.updateOne(state, {id: action.payload.id, changes: {...action.payload}})
        })
        builder.addCase(createUserStation.fulfilled, (state, action) => {
            usersAdapter.updateOne(state, action.payload)
        })
        builder.addCase(deleteUserStation.fulfilled, (state, action) => {
            usersAdapter.updateOne(state, action.payload)
        })
    }
})

export default usersSlice.reducer

export const {
    selectAll: getAllUsers,
    selectById: getUserById
} = usersAdapter.getSelectors((state: RootState) => state.users)
