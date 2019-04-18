import React from 'react';

const TimeSelector = (props) => (
    <div className={"time-selector"}>
        <label for="time-range">Choose data set:</label>
        <input type={"range"} className={"custom-range"} id={'time-range'}/>
    </div>
);

export default TimeSelector;