import React, {useState, useEffect} from 'react';
import './App.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import socket from "./components/socket"




function App() {

  interface TruckStuff {
    code: string;
    position: number[];
  }
  const [trucks, setTrucks] = useState<TruckStuff[]>([]);

  socket.on('TRUCKS', mensaje => {
    console.log('trucks!');
    
  });
  useEffect(() => {
    //const interval = setInterval(() => {

    socket.emit('TRUCKS');

    
    socket.on('POSITION', mensaje => {
      console.log(mensaje);
  
      const newTruck = {
        code: mensaje.code,
        position: mensaje.position,
      }
      var sameTruck = trucks.find(x => x.code === newTruck.code);
      if (typeof(sameTruck) !== "undefined") {
        var secondaryList = trucks;
        secondaryList[secondaryList.indexOf(sameTruck)] = newTruck;
        setTrucks(secondaryList);
      }else{
        setTrucks([...trucks, newTruck])
      }
  
    });
    //}, 1000);
        
    return () => {socket.off()}
  }, [trucks]);



  function askForTrucks(){
    console.log("Hola");
    socket.emit("TRUCKS");
  };

  const handleAddTruck = () => {
    const newTruck = {
      code: "abc",
      position: [10,10],
    }
    setTrucks([...trucks, newTruck])
  };



  return (

    <>
    <div>Hello World</div>

    <button onClick={askForTrucks}> TRUCKS </button>
    <button onClick={handleAddTruck}> ADD TRUCKS </button>
    <MapContainer center={[-34.5, -68.5]} zoom={10} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {trucks.map((camion) => (
        <Marker position={[camion.position[0],camion.position[1]]}>
        <Popup>
          {camion.code}
        </Popup>
        </Marker> 

      ))}
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
