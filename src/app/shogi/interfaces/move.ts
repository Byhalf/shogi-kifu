import {KomaType} from './koma';

export type movementType = '-' | 'x' | '*';
export type playerAction = Move | 'UNDO';

//western notation
export interface Move {
  koma: KomaType; //1
  origin?: { x: number, y: number };  // 2
  movement: movementType; // 3
  destination: { x: number, y: number }; //4
  promotion?: '=' | "*"; //5
  player: "sente" | "gote";
  eatenKoma?: KomaType;
}
