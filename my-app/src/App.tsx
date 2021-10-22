import React, {useState, useEffect} from 'react';
import './App.css';
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet'
import socket from "./components/socket"
import { TruckInfo, TruckPos } from './components/InfoTypes';
import {truckIcon, startIcon, destinationIcon} from './components/Map';

function App() {

  const [trucks, setTrucks] = useState<TruckPos[]>([]);
  const [trucksInfo, setTrucksInfo] = useState<TruckInfo[]>([]);


  useEffect(() => {


    socket.emit('TRUCKS');

    socket.on('TRUCKS', trucksInfo2 => {
      console.log(trucksInfo2);
      setTrucksInfo(trucksInfo2);
    });

    

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

        
    return () => {socket.off()}
  }, [trucks, trucksInfo]);



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



    <button onClick={askForTrucks}> TRUCKS </button>
    <button onClick={handleAddTruck}> ADD TRUCKS </button>
    <MapContainer center={[-22, -68.5]} zoom={10} scrollWheelZoom={true}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {trucks.map((camion) => (
        <Marker position={[camion.position[0],camion.position[1]]} icon = {truckIcon}>
        <Popup>
          {camion.code}
        </Popup>
        </Marker> 
      ))}
      {trucksInfo.map((trayecto) => (
        
        
        <>
        <Marker position={[trayecto.origin[0], trayecto.origin[1]]} icon = {startIcon}> <Popup> {trayecto.code} </Popup> </Marker>  
        <Marker position={[trayecto.destination[0], trayecto.destination[1]]} icon = {destinationIcon}> <Popup>{trayecto.code}</Popup></Marker>
        </>
      ))}


    </MapContainer>



    <h1> Información de los camiones </h1>
    <div className="card-container">
    {trucksInfo.map((info)=>
      <div className="card">
      <div><h3> Codigo: {info.code}</h3></div>
      <div><h3> Truck: {info.truck}</h3></div>
      <div><h3> Engine: {info.engine}</h3></div>
      <div><h3> Capacidad: {info.capacity}</h3></div>
      <div><h3> Origen: {info.origin}</h3></div>
      <div><h3> Destino: {info.destination}</h3></div>
      <div><h3> Estatus: {info.status}</h3></div>
      <h3>Operadores </h3>
      {info.staff.map((persona)=>
      <div><h3> {persona.name}, {persona.age} años</h3></div>
      )}
      </div>
    )}
    </div>
  </>

  );
}

export default App;
