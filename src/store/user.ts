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
           }: { stationId: number, userId: number }): Promise<unknown> => {
        const response = await createUserStationApi(stationId, userId)
        return response.data
    }
);

export const deleteUserStation = createAsyncThunk(
    'userStation/delete',
    async ({
               stationId,
               userId
           }: { stationId: number, userId: number }): Promise<unknown> => {
        const response = await deleteUserStationApi(stationId, userId)
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
        builder.addCase(updateUser.fulfilled, (state, action) => {
            usersAdapter.updateOne(state, {id: action.payload.id, changes: {...action.payload}})
        })
        builder.addCase(createUserStation.fulfilled, (state, action) => {
            const userId = action.meta.arg.userId;
            const stationId = action.meta.arg.stationId
            const stations = state.entities[userId]?.stations || []
            usersAdapter.updateOne(state, {
                id: userId,
                changes: {stations: [...stations, stationId]}
            })
        })
        builder.addCase(deleteUserStation.fulfilled, (state, action) => {
            const userId = action.meta.arg.userId;
            const stationId = action.meta.arg.stationId
            const stations: number[] = state.entities[userId]?.stations || []
            const newStations = stations.filter(s => s !== stationId)
            usersAdapter.updateOne(state, {
                id: userId,
                changes: {stations: newStations}
            })
        })
    }
})

export default usersSlice.reducer

export const {
    selectAll: getAllUsers,
    selectById: getUserById
} = usersAdapter.getSelectors((state: RootState) => state.users)
