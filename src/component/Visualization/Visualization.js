/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import {PhongMaterial} from '@luma.gl/core';
import {AmbientLight, PointLight, LightingEffect} from '@deck.gl/core';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import DeckGL from '@deck.gl/react';
import d3 from 'd3';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN; // eslint-disable-line

const ambientLight = new AmbientLight({
                                          color: [255, 255, 255],
                                          intensity: 1.0
                                      });

const pointLight1 = new PointLight({
                                       color: [255, 255, 255],
                                       intensity: 0.8,
                                       position: [-0.144528, 49.739968, 80000]
                                   });

const pointLight2 = new PointLight({
                                       color: [255, 255, 255],
                                       intensity: 0.8,
                                       position: [-3.807751, 54.104682, 8000]
                                   });

const lightingEffect = new LightingEffect({ambientLight, pointLight1, pointLight2});

const material = new PhongMaterial({
                                       ambient: 0.64,
                                       diffuse: 0.6,
                                       shininess: 32,
                                       specularColor: [51, 51, 51]
                                   });

export const INITIAL_VIEW_STATE = {
    longitude: -71.10232165,
    latitude: 42.340211768,
    zoom: 12,
    minZoom: 5,
    maxZoom: 15,
    pitch: 40.5,
    bearing: -27.396674584323023
};

const colorRange = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
];

const elevationScale = {min: 1, max: 10};

/* eslint-disable react/no-deprecated */
export class Visualization extends Component {
    static get defaultColorRange() {
        return colorRange;
    }

    constructor(props) {
        super(props);
        this.state = {
            elevationScale: elevationScale.min
        };

        this.startAnimationTimer = null;
        this.intervalTimer = null;

        this._startAnimate = this._startAnimate.bind(this);
        this._animateHeight = this._animateHeight.bind(this);
    }

    componentDidMount() {
        this._animate();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && this.props.data && nextProps.data.length !== this.props.data.length) {
            this._animate();
        }
    }

    componentWillUnmount() {
        this._stopAnimate();
    }

    _animate() {
        this._stopAnimate();

        // wait 1.5 secs to start animation so that all data are loaded
        this.startAnimationTimer = window.setTimeout(this._startAnimate, 1500);
    }

    _startAnimate() {
        this.intervalTimer = window.setInterval(this._animateHeight, 20);
    }

    _stopAnimate() {
        window.clearTimeout(this.startAnimationTimer);
        window.clearTimeout(this.intervalTimer);
    }

    _animateHeight() {
        if (this.state.elevationScale === elevationScale.max) {
            this._stopAnimate();
        } else {
            this.setState({elevationScale: this.state.elevationScale + 1});
        }
    }

    _renderLayers() {
        const {data, radius = 200, upperPercentile = 100, coverage = 1} = this.props;

        return [
            new HexagonLayer({
                                 id: 'heatmap',
                                 colorRange,
                                 coverage,
                                 data,
                                 elevationRange: [0, 500],
                                 elevationScale: this.state.elevationScale,
                                 extruded: true,
                                 getPosition: d => d,
                                 onHover: this.props.onHover,
                                 opacity: 1,
                                 pickable: Boolean(this.props.onHover),
                                 radius,
                                 upperPercentile,
                                 material
                             })
        ];
    }

    render() {
        const {viewState, controller = true, baseMap = true} = this.props;

        return (
            <DeckGL
                layers={this._renderLayers()}
                effects={[lightingEffect]}
                initialViewState={INITIAL_VIEW_STATE}
                viewState={viewState}
                controller={controller}
            >
                {baseMap && (
                    <StaticMap
                        reuseMaps
                        mapStyle="mapbox://styles/mapbox/dark-v9"
                        preventStyleDiffing={true}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                    />
                )}
            </DeckGL>
        );
    }
}