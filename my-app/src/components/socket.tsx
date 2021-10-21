import { io } from "socket.io-client";

const socket = io("wss://tarea-3-websocket.2021-2.tallerdeintegracion.cl", {
  path: "/trucks/",
});

socket.on("connect", function() {
  console.log('check connection', socket.connected)
});

export default socket;