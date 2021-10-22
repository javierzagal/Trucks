

interface people {
  name: string;
  age: number;
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

interface TruckPos {
  code: string;
  position: number[];
}

export type { TruckInfo, TruckPos}