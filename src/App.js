import React, {Component} from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import NavMapType from './component/NavMapType';
import NavSelectOrigin from './component/NavSelectOrigin';
import TimeSelector from './component/TimeSelector';
import {Visualization} from "./component/Visualization/Visualization";

import airportTiming from "./timing/json/airport";
import cityhallTiming from "./timing/json/cityhall";
import harvardTiming from "./timing/json/harvard";
import northeasternTiming from "./timing/json/northeastern";

import d3 from "d3";
import {render} from "react-dom";
import './css/main.css';

const vizWrapperStyle = {
    height: "100%",
};

const sortTimingArray = (array) => {
    array.sort((entry1, entry2) => {
        if (entry1.time < entry2.time) return -1;
        if (entry1.time > entry2.time) return 1;
        return 0;
    });
};

const getArrayElementFromRatio = (array, ratio) => {
  const index = Math.round(ratio * (array.length - 1));
  return array[index];
};

let dataSourceURL = "data/sample.csv";

const constructDataUrl = (graphType, graphOrigin, graphTime) => {
    let timePrepend = graphTime.split(" ").join("_"); //replace spaces with underscores (filename)
    timePrepend = timePrepend.split(":").join("_"); //replace colons with underscores (filename)
    const typeAppend = ((gt) => {
    switch(gt) {
        case "lyft-dur":
            return "lyft_time";
        case "transit-dur":
            return "gmaps_time";
        case "lyft-price":
            return "lyft_cost";
        default:
            return "";
    }}) (graphType);

    return "data/" + graphOrigin + "/out/" + timePrepend + typeAppend + ".csv";
};

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataSet: null
        };
        this.graphType = "lyft-dur";
        this.graphOrigin = "northeastern";
        this.graphTime = 0.0;
        this.timingString = "";

        sortTimingArray(harvardTiming);
        sortTimingArray(northeasternTiming);
        sortTimingArray(cityhallTiming);
        sortTimingArray(airportTiming);
    }

    componentDidMount() {
        this.loadDataFromSource(dataSourceURL);
    }

    loadDataFromSource(url) {
        require('d3-request').csv(url, (error, response) => {
            if (!error) {
                const data = response.map(d => [Number(d.lng), Number(d.lat)]);
                this.setState({
                                  dataSet: data
                              });
            } else {
                this.setState({
                                    dataSet: null
                              });
            }
        });
    }

    constructUrl() {
        let timingArray = ((o) => {switch(o) {
            case "airport":
                return airportTiming;
            case "northeastern":
                return northeasternTiming;
            case "harvard":
                return harvardTiming;
            case "cityhall":
                return cityhallTiming;
            default:
                return [];
        }}) (this.graphOrigin);
        const timingString = getArrayElementFromRatio(timingArray, this.graphTime).time;
        this.timingString = timingString;
        return constructDataUrl(this.graphType, this.graphOrigin, timingString);
    }

    processCategoryClick = result => {
        this.graphType = result;
        this.loadDataFromSource(this.constructUrl());
    };

    processOriginChange = originName => {
        this.graphOrigin = originName;
        this.loadDataFromSource(this.constructUrl());
    };

    processTimingChange = sliderVal => {
        this.graphTime = sliderVal;
        this.loadDataFromSource(this.constructUrl());
    };

    render() {
        let date = new Date(this.timingString);
        let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour12: true, timeZone: "America/New_York", hour: "numeric", minute: "numeric"};
            if (this.state.dataSet) {
                return (
                    <>
                    <div className="container">
                        <header className="header-overlay">
                            <NavMapType onNav={this.processCategoryClick.bind(this)}
                                        currentType={this.graphType}/>
                            <NavSelectOrigin onOriginChange={this.processOriginChange.bind(this)}/>
                        </header>
                        <TimeSelector
                            onSliderChange={this.processTimingChange.bind(this)}
                            currentTime={date.toLocaleDateString('en-US', dateOptions)}
                        />
                    </div>
                    <div style={vizWrapperStyle}>
                         <Visualization data={this.state.dataSet} />
                    </div>
                    </>
                );
            } else {
                return (
                    <div className="container">
                        <header className="App-header">
                            <NavMapType onNav={() => null}/>
                            <NavSelectOrigin onOriginChange={() => null}/>
                        </header>
                        <div>error loading data.</div>
                    </div>
                );
            }
    }
}

export default App;
