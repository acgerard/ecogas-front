import {green_2} from "../../../index";
import {ResponsiveLine, Serie} from "@nivo/line";
import React from "react";

export function TimeLine({data, type}: { data: Serie[], type: 'day' | 'month' | 'year' }) {

    return <ResponsiveLine
        data={data}
        margin={{top: 50, right: 110, bottom: 50, left: 60}}
        xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            useUTC: false,
            precision: 'day',
        }}
        xFormat="time:%d-%m-%Y"
        yScale={{
            type: 'linear',
            stacked: false,
            min: 'auto',
            max: 'auto',
            reverse: false
        }}
        axisLeft={{
            legend: 'Volume (L)',
            legendOffset: 12,
        }}
        axisBottom={{
            format: type === 'day' ? '%b %d' : type === 'month' ? '%b' : '%y',
            tickValues: `every ${type}`,
            // legend: 'Date',
            // legendOffset: 36,
            // legendPosition: 'middle'
        }}
        curve={'monotoneX'}
        colors={[green_2]}
        enablePointLabel={false}
        pointSize={10}
        pointBorderColor={{theme: 'background'}}
        pointBorderWidth={2}
        pointLabelYOffset={-12}
        useMesh={true}
        enableSlices={false}
    />

}