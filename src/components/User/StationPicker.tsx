import {useSelector} from "react-redux";
import {getStations} from "../../store/station";
import {Checkbox, InputLabel, ListItemText, MenuItem, OutlinedInput, SelectChangeEvent} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import React from "react";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export function StationPicker(props: { stations: number[], onChange: (stations: number[]) => void }) {
    const allStations = useSelector(getStations)

    const handleChange = (event: SelectChangeEvent<number[]>) => {
        const {
            target: {value},
        } = event;
        props.onChange(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',').map(v => Number(v)) : value,
        );
    };

    return <FormControl>
        <InputLabel id={"create-user-station"}>Stations</InputLabel>
        <Select
            labelId="create-user-station"
            id="create-user-station-checkbox"
            multiple
            value={props.stations}
            onChange={handleChange}
            input={<OutlinedInput label="Stations"/>}
            renderValue={(selected) => selected.join(', ')}
            MenuProps={MenuProps}
        >
            {allStations.map((station) => (
                <MenuItem key={station.id} value={station.id}>
                    <Checkbox checked={props.stations.indexOf(station.id) > -1}/>
                    <ListItemText primary={station.name}/>
                </MenuItem>
            ))}
        </Select>
    </FormControl>
}