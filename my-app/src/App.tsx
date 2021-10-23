import React, {useState, useEffect} from 'react';
import './App.css';
import {MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet'
import socket from "./components/socket"
import {TruckInfo, TruckPos, getRandomInt, failureInfo, chatMessage } from './components/InfoTypes';
import {trucksIcons, startIcon, destinationIcon} from './components/Map';

function App() {

  const [trucks, setTrucks] = useState<TruckPos[]>([]);
  const [trucksInfo, setTrucksInfo] = useState<TruckInfo[]>([]);

	// CHAT
	const [ chat, setChat ] = useState<chatMessage[]>([])
  const [mensaje, setMensaje] = useState("")

  const [username, setUsername] = useState("defaultUser")

  useEffect(() => {
    socket.emit('TRUCKS');
    socket.emit('CHAT');

    socket.on('TRUCKS', trucksInfo2 => { // Posiciones de los camiones
      //console.log(trucksInfo2);
      setTrucksInfo(trucksInfo2);
    });

    socket.on('CHAT', (mensaje: {date:string, message: string, name: string})=>{
      console.log(mensaje);
      setChat([...chat, mensaje])
    })

    
    socket.on('POSITION', mensaje => {
      //sole.log(mensaje);
      const newTruck = {
        code: mensaje.code,
        position: mensaje.position,
        iconInt: getRandomInt(0,2),
      }
      var sameTruck = trucks.find(found => found.code === newTruck.code);
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


  const handleSendChat = () => {

    const MensajeEnviar = {
      message: mensaje,
      name: username,
    }
    socket.emit("CHAT", MensajeEnviar);
    //setChat(prev => [...prev, {msj,name}]);

    setMensaje("");
    
    console.log(mensaje)
  };

  const handleChangeUsername = () => {
    setUsername(username);
  }



  return (

    <>
    <div className = "overall">
    
    <div className="map-chat">

      <div className="map">
      <MapContainer center={[-22, -68.5]} zoom={10} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

        {trucks.map((camion) => (
          <Marker position={[camion.position[0],camion.position[1]]} icon = {trucksIcons[camion.iconInt]}>
          <Popup>
            {camion.code} 
          </Popup>
          </Marker> 
        ))}

        {trucksInfo.map((trayecto) => (
          <>
          <Polyline positions={[[trayecto.origin[0], trayecto.origin[1]],[trayecto.destination[0], trayecto.destination[1]]]} />
          <Marker position={[trayecto.origin[0], trayecto.origin[1]]} icon = {startIcon}> <Popup> {trayecto.code} </Popup> </Marker>  
          <Marker position={[trayecto.destination[0], trayecto.destination[1]]} icon = {destinationIcon}> <Popup>{trayecto.code}</Popup></Marker>
          </>
        ))}
      </MapContainer>
      </div>
      
      <div className= "chat-box">
        <p className="p1"> Chat </p>
        <form onSubmit= {e => {
          e.preventDefault()
          handleSendChat();
        }}>
          <input
            type= "text"
            value = {mensaje}
            placeholder= 'Ingresa un mensaje'
            onChange= {e => setMensaje(e.target.value)}
          />
          <button type= "submit"> ENVIAR </button>
        </form>
        <form onSubmit={e => {
          e.preventDefault()
          handleChangeUsername();
        }}>
          <input 
            type="text" 
            value= {username} 
            placeholder= 'Ingresa un nombre de usuario' 
            onChange = {e=> setUsername(e.target.value)}
          />
          <button type= "submit"> Cambiar </button>
        </form>

        <div className= "chat-container">
          {chat.map((mensaje)=>
          <div className="msj-container"> 
            <div><h3> Mensaje: {mensaje.message} </h3></div>
            <div><h3> Date: {mensaje.date} </h3></div>
            <div><h3> Name: {mensaje.name} </h3></div>
          </div>
          )}
          
        </div>
      </div>
    </div> 
    


    <div className="infobox">
      <p className="p1"> Información de los camiones</p>
      <div className="card-container">
      {trucksInfo.map((info)=>
        <div className="card">
          <div className="card-title"><h1> Codigo: {info.code}</h1></div>
          <div><h3> Truck: {info.truck}</h3></div>
          <div><h3> Engine: {info.engine}</h3></div>
          <div><h3> Capacidad: {info.capacity}</h3></div>
          <div><h3> Origen: {info.origin}</h3></div>
          <div><h2>Destino: </h2><h3> {info.destination}</h3></div>
          <div><h3> Estatus: {info.status}</h3></div>
          <h2> <i>Operadores</i></h2>
          {info.staff.map((persona)=>
          <div><h3> {persona.name}, {persona.age} años</h3></div>
          )}
        </div>
      )}
      </div>
    </div>

    </div>
  </>

  );
}

export default App;
