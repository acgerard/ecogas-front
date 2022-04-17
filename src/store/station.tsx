import {createAsyncThunk, createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {RootState} from "../app/store";
import {REDUX_STATUS} from "../helpers/constants";
import {createStation as createStationApi, getUserStations, Station} from "../api/stations";


export const fetchStations = createAsyncThunk(
    'stations/fetch',
    async () => {
        const response = await getUserStations()
        return response.data
    }
);
export const createStation = createAsyncThunk(
    'stations/create',
    async ({id, name}: { id: number, name: string }) => {
        const response = await createStationApi(id, name)
        return response.data
    }
);

export const stationsAdapter = createEntityAdapter<Station>()

const stationsInitialState = stationsAdapter.getInitialState({
    status: REDUX_STATUS.INIT,
    selected: null as number | null
})

export const stationsSlice = createSlice({
    name: 'stations',
    initialState: stationsInitialState,
    reducers: {
        selectStation(state, action) {
            state.selected = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchStations.pending, (state, action) => {
            state.status = REDUX_STATUS.FETCHING
        })
        builder.addCase(fetchStations.fulfilled, (state, action) => {
            stationsAdapter.setAll(state, action.payload)
            state.status = REDUX_STATUS.OK
            if (action.payload.length > 0) {
                state.selected = action.payload[0].id
            }
        })
        builder.addCase(fetchStations.rejected, (state, action) => {
            state.status = REDUX_STATUS.ERROR
        })
        builder.addCase(createStation.fulfilled, (state, action) => {
            stationsAdapter.addOne(state, action.payload)
        })
    }
})


export const {selectStation} = stationsSlice.actions
export default stationsSlice.reducer

export const {
    selectAll: getStations,
    selectById: getStationById,
    selectEntities: getStationsById,
    selectTotal: getNbStations,
} = stationsAdapter.getSelectors((state: RootState) => state.stations)

export const getSelectedStationId = (state: RootState) => state.stations.selected

export const getSelectedStation = createSelector([getStationsById, getSelectedStationId], (stationsById, selected) => {
    if (!!selected) {
        return stationsById[selected]
    }
    return null
})