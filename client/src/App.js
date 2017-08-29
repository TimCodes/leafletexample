import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Map, Marker, Popup, TileLayer, Circle, FeatureGroup} from 'react-leaflet';
import axios from 'axios';
import { EditControl } from "react-leaflet-draw"


const position = [34.0522, -118.2437];
class App extends Component {
constructor(props) {
  super(props);
  this.state = {
    features : [],
  };
  this.onCreate = this.onCreate.bind(this)
  axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson')
  .then(res => { this.setState({ features: res.data.features }); console.log(res) } )
}
onCreate(e){
  console.log(e.layer.toGeoJSON(), e.layer.getRadius())
  let geojson = e.layer.toGeoJSON();
  let coords  = geojson.geometry.coordinates
  axios.post("http://localhost:3030/graphics", {
     type: 'circle',
     radius :  e.layer.getRadius(),
     coordinates :coords
  })
}
  render() {
   
    let earthquakes = this.state.features.map( f => {
      console.log(typeof f.geometry.coordinates[1])
     return  <Circle center={[ f.geometry.coordinates[1] , f.geometry.coordinates[0] ]} radius={20000 * f.properties.mag}> 
        <Popup>
          <span>
           <h4>{f.properties.title}</h4>
           <ul>
             <li>Magnitude : {f.properties.mag}</li>
             <li>Time : {new Date(f.properties.time).toLocaleString()}</li>
           </ul>
           <a href={f.properties.url} target="_blank">detail</a>
          </span>
        </Popup>
       </Circle>
    })
    console.log(earthquakes)
    return (
     <Map center={position} zoom={5}>
      <TileLayer
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      {earthquakes} 
  
 
     </Map>
    );
  }
}

export default App;
