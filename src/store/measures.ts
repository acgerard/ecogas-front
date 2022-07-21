import {combineReducers, createAsyncThunk, createEntityAdapter, createSelector, createSlice} from "@reduxjs/toolkit";
import {getMeasures, Measure, MeasureGranularity} from "../api/measures";
import {DateTime} from 'luxon';
import {RootState} from "../app/store";
import {REDUX_STATUS} from "../helpers/constants";

export const fetchTodayMeasures = createAsyncThunk(
    'measures/today',
    async (stationId: number) => {
        const beginingDay = DateTime.now().minus({days: 1}).startOf('day')
        const response = await getMeasures(stationId, beginingDay.toSeconds(), MeasureGranularity.DAY)
        return response.data
    }
);
export const fetchDailyMeasures = createAsyncThunk(
    'measures/daily',
    async (stationId: number) => {
        const beginingMonth = DateTime.now().startOf('month')
        const response = await getMeasures(stationId, beginingMonth.toSeconds(), MeasureGranularity.DAY)
        return response.data
    }
);
export const fetchMonthlyMeasures = createAsyncThunk(
    'measures/monthly',
    async (stationId: number) => {
        const beginningMonth = DateTime.now().startOf('year')
        const response = await getMeasures(stationId, beginningMonth.toSeconds(), MeasureGranularity.MONTH)
        return response.data
    }
);
export const fetchYearlyMeasures = createAsyncThunk(
    'measures/yearly',
    async (stationId: number) => {
        const oldDate = DateTime.now().minus({year: 1})
        const response = await getMeasures(stationId, oldDate.toSeconds(), MeasureGranularity.YEAR)
        return response.data
    }
);

export const todayMeasuresAdapter = createEntityAdapter<Measure>({
    selectId: data => data?.date,
    sortComparer: (m1, m2) => m2.date.localeCompare(m1.date)
})
export const dailyMeasuresAdapter = createEntityAdapter<Measure>({
    selectId: data => data?.date,
    sortComparer: (m1, m2) => m2.date.localeCompare(m1.date)
})
export const monthlyMeasuresAdapter = createEntityAdapter<Measure>({
    selectId: data => data?.date,
    sortComparer: (m1, m2) => m2.date.localeCompare(m1.date)
})
export const yearlyMeasuresAdapter = createEntityAdapter<Measure>({
    selectId: data => data?.date,
    sortComparer: (m1, m2) => m2.date.localeCompare(m1.date)
})

const todayMeasuresInitialState = todayMeasuresAdapter.getInitialState({
    status: REDUX_STATUS.INIT
})
const dailyMeasuresInitialState = dailyMeasuresAdapter.getInitialState({
    status: REDUX_STATUS.INIT
})
const monthlyMeasuresInitialState = monthlyMeasuresAdapter.getInitialState({
    status: REDUX_STATUS.INIT
})
const yearlyMeasuresInitialState = yearlyMeasuresAdapter.getInitialState({
    status: REDUX_STATUS.INIT
})

export const todayMeasuresSlice = createSlice({
    name: 'today',
    initialState: todayMeasuresInitialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchTodayMeasures.pending, (state) => {
            state.status = REDUX_STATUS.FETCHING
        })
        builder.addCase(fetchTodayMeasures.fulfilled, (state, action) => {
            todayMeasuresAdapter.setAll(state, action.payload)
            state.status = REDUX_STATUS.OK
        })
        builder.addCase(fetchTodayMeasures.rejected, (state) => {
            state.status = REDUX_STATUS.ERROR
        })
    }
})
export const dailyMeasuresSlice = createSlice({
    name: 'daily',
    initialState: dailyMeasuresInitialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchDailyMeasures.pending, (state) => {
            state.status = REDUX_STATUS.FETCHING
        })
        builder.addCase(fetchDailyMeasures.fulfilled, (state, action) => {
            dailyMeasuresAdapter.setAll(state, action.payload)
            state.status = REDUX_STATUS.OK
        })
        builder.addCase(fetchDailyMeasures.rejected, (state) => {
            state.status = REDUX_STATUS.ERROR
        })
    }
})
export const monthlyMeasuresSlice = createSlice({
    name: 'monthly',
    initialState: monthlyMeasuresInitialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchMonthlyMeasures.pending, (state) => {
            state.status = REDUX_STATUS.FETCHING
        })
        builder.addCase(fetchMonthlyMeasures.fulfilled, (state, action) => {
            monthlyMeasuresAdapter.setAll(state, action.payload)
            state.status = REDUX_STATUS.OK
        })
        builder.addCase(fetchMonthlyMeasures.rejected, (state) => {
            state.status = REDUX_STATUS.ERROR
        })
    }
})

export const yearlyMeasuresSlice = createSlice({
    name: 'yearly',
    initialState: yearlyMeasuresInitialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchYearlyMeasures.pending, (state) => {
            state.status = REDUX_STATUS.FETCHING
        })
        builder.addCase(fetchYearlyMeasures.fulfilled, (state, action) => {
            yearlyMeasuresAdapter.setAll(state, action.payload)
            state.status = REDUX_STATUS.OK
        })
        builder.addCase(fetchYearlyMeasures.rejected, (state) => {
            state.status = REDUX_STATUS.ERROR
        })
    }
})

export default combineReducers({
    today: todayMeasuresSlice.reducer,
    daily: dailyMeasuresSlice.reducer,
    monthly: monthlyMeasuresSlice.reducer,
    yearly: yearlyMeasuresSlice.reducer
})

export const {
    selectAll: getTodayMeasures,
} = todayMeasuresAdapter.getSelectors((state: RootState) => state.measures.today)

export const {
    selectAll: getDailyMeasures,
} = dailyMeasuresAdapter.getSelectors((state: RootState) => state.measures.daily)

export const {
    selectAll: getMonthlyMeasures,
} = monthlyMeasuresAdapter.getSelectors((state: RootState) => state.measures.monthly)

export const {
    selectAll: getYearlyMeasures,
} = yearlyMeasuresAdapter.getSelectors((state: RootState) => state.measures.yearly)

export function getTodayStatus(state: RootState) {
    return state.measures.today.status
}

export const getTodayDiesel = createSelector([getTodayMeasures], measures => {
    if (measures.length === 0) return null
    if (measures.length === 1) return measures[0].v_diesel
    return measures[0].v_diesel - measures[1].v_diesel
})
export const getTodayEcogas = createSelector([getTodayMeasures], measures => {
    if (measures.length === 0) return null
    if (measures.length === 1) return measures[0].v_ecogas
    return measures[0].v_ecogas - measures[1].v_ecogas
})
export const getThisYearDiesel = createSelector([getYearlyMeasures], measures => {
    if (measures.length === 0) return null
    if (measures.length === 1) return measures[0].v_diesel
    return measures[0].v_diesel - measures[1].v_diesel
})
export const getThisYearEcogas = createSelector([getYearlyMeasures], measures => {
    if (measures.length === 0) return null
    if (measures.length === 1) return measures[0].v_ecogas
    return measures[0].v_ecogas - measures[1].v_ecogas
})

export const getEcogasRemaining = createSelector([getYearlyMeasures], measures => {
    if (measures.length > 0) {
        return measures[measures.length - 1].v_tank
    } else return null
})