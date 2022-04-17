import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import authenticationReducer from '../store/authentication';
import measureReducer from '../store/measures';
import stationsReducer from '../store/station';
import userReducer from '../store/user';

export const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        users: userReducer,
        measures: measureReducer,
        stations: stationsReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
    RootState,
    unknown,
    Action<string>>;
