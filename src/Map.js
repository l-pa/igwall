import React, { Component } from 'react';
import styled from 'styled-components'
import DeckGL, { ScatterplotLayer } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css'

import InstagramEmbed from 'react-instagram-embed'



const MAPBOX_TOKEN = 'pk.eyJ1Ijoic2lrcml0IiwiYSI6ImNqcjU2amFoYzFzbzk0NW94d3YycWJ5MWMifQ.TX-N7lL1U2OesaHQ2QlKIg';

const Image = styled.img`
    border-radius: 50%;
    width: 300px;
    height: 300px;
    margin 0.5em;
    transition: transform .2s; /* Animation */
`;

// Initial viewport settings
const initialViewState = {
    longitude: 14.4215,
    latitude: 50.0876,
    zoom: 4,
    pitch: 0,
    bearing: 0,
    width: 500,
    height: 500
};

class Map extends Component {
    constructor(props) {
        super(props);
        this.getDataAsync = this.getDataAsync.bind(this)

        this.state = {
            id: '',
            loaded: false,
            data: '',
            hoveredObject: null,
            pointerX: 0,
            pointerY: 0
        };
        this.getDataAsync()
        // this.state.data = this.getDataAsync()
    }

    getDataAsync() {
        return fetch('http://localhost:5000/user/kamiloss_01/map')
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    loaded: true,
                    data: responseJson
                });
                return responseJson;
            })
            .catch((error) => {
                console.error(error);
            });
    }


    componentWillReceiveProps(nextProps) {
        this.setState({ id: nextProps.id });
    }

    componentDidMount() {

    }

    _renderTooltip() {
        const { hoveredObject, pointerX, pointerY } = this.state || {};
        return hoveredObject && (
            <div className='mapImage' style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none', left: pointerX, top: pointerY }}>

                <InstagramEmbed
                    url={'https://instagr.am/p/' + hoveredObject.code}
                    maxWidth={320}
                    hideCaption={false}
                    containerTagName='div'
                    protocol=''
                    injectScript
                    onLoading={() => {
                    }}
                    onSuccess={() => { }}
                    onAfterRender={() => { }}
                    onFailure={() => { }}
                />
            </div>
        );
    }



    render() {
        if (!this.state.loaded) {
            return (
                <div className="map">
                    Loading
                </div>
            );
        }
        else {
            const layers = [
                new ScatterplotLayer({
                    id: 'scatterplot-layer',
                    data: this.state.data,
                    pickable: true,
                    opacity: 0.8,
                    radiusScale: 40,
                    radiusMinPixels: 0,
                    radiusMaxPixels: Number.MAX_SAFE_INTEGER,
                    getPosition: d => d.coordinates,
                    getRadius: d => 25,
                    getColor: d => [255, 140, 0],
                    onHover: info => this.setState({
                        hoveredObject: info.object,
                        pointerX: info.x,
                        pointerY: info.y
                    }),
                    onClick: info => window.open('https://instagr.am/p/' + info.object.code, "_blank")

                })
            ];

            return (
                <div className="map">
                    <DeckGL
                        initialViewState={initialViewState}
                        controller={true}
                        layers={layers}
                    >
                        {this._renderTooltip()}

                        <StaticMap
                            width={400}
                            height={400}
                            zoom={2}
                            reuseMaps
                            mapStyle="mapbox://styles/mapbox/dark-v9"
                            preventStyleDiffing={false}
                            mapboxApiAccessToken={MAPBOX_TOKEN}
                        />
                    </DeckGL>
                </div>
            );
        }
    }
    handleStyleLoad = map => (map.resize())

}

export default Map;