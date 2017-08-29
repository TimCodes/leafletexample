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
    circles : []
  };
  this.onCreate = this.onCreate.bind(this)
  axios.get('/graphics')
   .then(res => res.data.data.filter(c => c.type === 'circle') )
   .then(c => this.setState({circles: c } ))
}
onCreate(e){
  console.log(e.layer.toGeoJSON(), e.layer.getRadius())
  let geojson = e.layer.toGeoJSON();
  let coords  = geojson.geometry.coordinates
  axios.post("/graphics", {
     type: 'circle',
     radius :  e.layer.getRadius(),
     coordinates :coords
  })
}
  render() {
     let cicles = this.state.circles.map( c => {
      console.log(typeof c.coordinates[1])
     return  <Circle center={[ c.coordinates[1] , c.coordinates[0] ]} radius={c.radius}> 
      
       </Circle>
    })

    return (
     <Map center={position} zoom={5}>
      <TileLayer
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      {cicles} 
  
  <FeatureGroup>
    <EditControl
      position='topright'
      onCreated={this.onCreate}
      onDeleted={this.onDeleted}
      draw={{
        rectangle: false,
        marker: false,
        polyline: false,
        cirlcemaker: false,
        polygon:false,
        delete: false
      }}
      edit={{
        edit: false,
       remove: false
      }}
    />
    
  </FeatureGroup>
     </Map>
    );
  }
}

export default App;
