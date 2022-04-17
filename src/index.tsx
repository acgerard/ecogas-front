import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {store} from './app/store';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';
import {App} from "./components/App/App";
import {createTheme, ThemeProvider} from "@mui/material";


// const blue_1 = '#00386a'
// const blue_2 = '#0081b8'
const blue_3 = '#009ee0'
// const blue_4 = '#83d0f0'
// const green_1 = '#005b28'
const green_2 = '#7ab51d'
// const green_3 = '#b1ca35'
// const green_4 = '#dde069'
// const blue_base = blue_3
// const green_dark_base = green_1
// const green_light_base = green_2


const theme = createTheme({
    palette: {
        primary: {
            main: green_2,
        },
        secondary: {
            main: blue_3,
        },
    },
})

ReactDOM.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <BrowserRouter basename={'/front/ecogas'}>
                    <App/>
                </BrowserRouter>
            </Provider>
        </ThemeProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
