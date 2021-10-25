import React, {useState, useEffect} from 'react';
import './App.css';
import {MapContainer, TileLayer, Marker, Popup, Polyline} from 'react-leaflet'
import socket from "./components/socket"
import {TruckInfo, TruckStatus, TruckPos, getRandomInt, failureInfo, chatMessage } from './components/InfoTypes';
import {trucksIcons, startIcon, destinationIcon} from './components/Map';
import { stringify } from 'querystring';
import { debug, info } from 'console';

function App() {
  // Camiones
  const [trucks, setTrucks] = useState<TruckPos[]>([]);
  const [trucksInfo, setTrucksInfo] = useState<TruckInfo[]>([]);
  const [trucksStatus, setTrucksStatus] = useState<TruckStatus[]>([]);
  const [truckToFix, setTruckToFix] = useState("")


	// CHAT
	const [ chat, setChat ] = useState<chatMessage[]>([])
  const [mensaje, setMensaje] = useState("")

  const [username, setUsername] = useState("defaultUser")

  useEffect(() => {
    socket.emit('TRUCKS');
    socket.emit('CHAT');
    // socket.emit('FIX'); DEBE PODER EMITIRSE Y ARREGLAR EL CAMION -> 

    socket.on('TRUCKS', trucksInfoUpdated => { // Posiciones de los camiones
      //console.log(trucksInfoUpdated);
      setTrucksInfo(trucksInfoUpdated);
    });
    
    socket.on('FAILURE', (failureInfo: {code: string, source:string}) => {
      //console.log(failureInfo);
      failureInfo.source = "Falla de ".concat(failureInfo.source);
      // Crear otro useState con una lista que tenga code y status solamente, luego mapear eso en render
      var failedTruck = trucksStatus.find(found => found.code === failureInfo.code)!
      if (typeof(failedTruck) !== "undefined") { 
        var secondaryList = trucksStatus;
        secondaryList[secondaryList.indexOf(failedTruck)] = failureInfo;
        setTrucksStatus(secondaryList);
      }else{
        setTrucksStatus([...trucksStatus, failureInfo])
      }
    })

    socket.on('CHAT', (mensaje: {date:string, message: string, name: string})=>{
      //console.log(mensaje);
      setChat([...chat, mensaje])
    })
    
    socket.on('FIX', (fixInfo: {code: string}) => {
      //console.log(fixInfo);
      
      const newStatus = {
        code: fixInfo.code,
        source: 'OK',
      }
      var fixedTruck = trucksStatus.find(found => found.code === fixInfo.code)!
      var secondaryList = trucksStatus;
      secondaryList[trucksStatus.indexOf(fixedTruck)] = newStatus;
      setTrucksStatus(secondaryList);

    })
    
    socket.on('POSITION', mensaje => {
      //sole.log(mensaje);
      const newTruck = {
        code: mensaje.code,
        position: mensaje.position,
        iconInt: getRandomInt(0,2),
      }
      const newTruckStatus = {
        code: mensaje.code,
        source: "OK",
      }
      var sameTruck = trucks.find(found => found.code === newTruck.code);
      if (typeof(sameTruck) !== "undefined") { // si existe, actualizar datos
        var secondaryList = trucks;           //updated list
        secondaryList[secondaryList.indexOf(sameTruck)] = newTruck; //asignar
        setTrucks(secondaryList);
      }else{
        setTrucksStatus([...trucksStatus, newTruckStatus])
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
  };

  const handleChangeUsername = () => {
    setUsername(username);
  }
  

  const handleFixTruck = () =>{
    socket.emit('FIX', {code: truckToFix});
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
        <br/>
        <p> Nombre de usuario: </p>
        <form onSubmit={e => {
          e.preventDefault()
          handleChangeUsername();
        }}>
          <input 
            type="text" 
            value= {username} 
            placeholder= 'Username' 
            onChange = {e=> setUsername(e.target.value)}
          />
          <button type= "submit"> Cambiar </button>
        </form>

        <div className= "chat-container">
          {chat.map((mensaje)=>
          <div className="msj-container"> 
            <div><p className = "user-name"> {mensaje.name} </p></div>
            <div className="msj-text">
              <h3>{mensaje.message} </h3>
              <p> Date: {mensaje.date} </p>
              <br></br>
            </div>
          </div>
          )}
          
        </div>

        <br/>
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
      </div>
    </div> 
    


    <div className="infobox">
      <p className="p1"> Información de los camiones</p>
      <br/>
      <div className="card-container">
      {trucksInfo.map((info)=>
        
        <div className="card">
          <div className="card-title"><h1> Codigo: {info.code}</h1></div>

          <div className='truckinfo-text'>
            <div><h3> Truck: {info.truck}</h3></div>
            <div><h3> Engine: {info.engine}</h3></div>
            <div><h3> Capacidad: {info.capacity}</h3></div>
            <div><h3> Origen: {info.origin}</h3></div>
            <div><h2>Destino: </h2><h3> {info.destination}</h3></div>
            <div><h3> Estatus: {
              trucksStatus.find(found => found.code === info.code)?.source 
              }</h3>
              <form
                onSubmit={e => {
                  setTruckToFix(info.code)
                  handleFixTruck()
                }}
              >
              <button type="submit"> FIX </button>
              </form>
            </div>
            <h2> Operadores</h2>
            {info.staff.map((persona)=>
            <div><h3> {persona.name}, {persona.age} años</h3></div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>

    </div>
  </>

  );
}

export default App;
