

interface people {
  name: string;
  age: number;
}
  
interface chatMessage {
  date: string;
  message: string;
  name: string;
}

interface failureInfo{
  code: string;
  source: string;
}

interface TruckInfo {
  code: string;
  origin: number[];
  destination: number[];
  driver_name: string;
  engine: string;
  capacity: number;
  status: string;
  truck: string;
  staff: people[];
}

interface TruckStatus {
  code: string;
  source: string;
}

interface TruckPos {
  code: string;
  position: number[];
  iconInt: number;
}

export function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export type { TruckInfo, TruckPos, chatMessage, failureInfo, TruckStatus}