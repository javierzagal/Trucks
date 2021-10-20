import React from 'react';
import './App.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import socket from "./components/socket"




function App() {

  function askForTrucks(){
    console.log("Hola");
    socket.emit("TRUCKS");
  };



  return (

    <>
    <div>Hello World</div>
    <button onClick={askForTrucks}> TRUCKS </button>
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  </>

  );
}

export default App;
