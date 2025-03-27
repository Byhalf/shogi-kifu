import {Koma} from './koma';
import {Tile} from './tile';

export type movementType =  '-'|'x'|'*';
//western notation
export interface Move {
  piece : Koma | undefined; //1
  origin? : {x:number,y:number };  // 2
  movement : movementType; // 3
  destination : {x:number,y:number }; //4
  promotion? : boolean; //5
}
