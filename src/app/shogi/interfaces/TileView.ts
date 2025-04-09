import {Koma} from './koma';
import {Tile} from './tile';

export interface TileView extends Tile {
  x: number;
  y: number;
  koma?: Koma;
  color?: string;
}
