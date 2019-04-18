import React from 'react';

const TimeSelector = (props) => (
    <div className={"time-selector"}>
        <label for="time-range">{props.currentTime}</label>
        <input type={"range"}
               className={"custom-range"}
               id={'time-range'}
               min={0}
               max={1}
               step={0.001}
               onChange={(e) => props.onSliderChange(e.target.value)}/>
    </div>
);

export default TimeSelector;