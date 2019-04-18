import React, {Component} from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import NavMapType from './component/NavMapType';
import NavSelectOrigin from './component/NavSelectOrigin';
import TimeSelector from './component/TimeSelector';
import {Visualization} from "./component/Visualization/Visualization";
import d3 from "d3";
import {render} from "react-dom";
import './css/main.css';

const vizWrapperStyle = {
    height: "100%",
};
let dataSourceURL = "data/sample.csv";

const constructDataUrl = (graphType, graphOrigin, graphTime) => {
    const timePrepend = "2019-04-09_17_43_01.941751-04_00";
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
        this.graphTime = "";
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
        return constructDataUrl(this.graphType, this.graphOrigin, this.graphTime);
    }

    processCategoryClick = result => {
        this.graphType = result;
        this.loadDataFromSource(this.constructUrl());
    };

    processOriginChange = originName => {
        this.graphOrigin = originName;
    };

    render() {
            if (this.state.dataSet) {
                return (
                    <>
                    <div className="container">
                        <header className="header-overlay">
                            <NavMapType onNav={this.processCategoryClick.bind(this)}
                                        currentType={this.graphType}/>
                            <NavSelectOrigin onOriginChange={this.processOriginChange.bind(this)}/>
                        </header>
                        <TimeSelector />
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
