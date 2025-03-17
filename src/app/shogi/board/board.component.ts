import { Component } from '@angular/core';

import { TileComponent } from '../tile/tile.component';
import { Tile } from '../interfaces/tile';
import {INITIAL_SHOGI_BOARD, Koma} from '../interfaces/koma';

@Component({
  selector: 'shogi-board',
  imports: [TileComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  readonly boardTiles: Array<Tile> = [];
  readonly width: number = 9;
  constructor() {
    for (let x: number = 0; x < this.width; x++) {
      for (let y: number = 0; y < this.width; y++) {
        this.boardTiles[x + y * this.width] = { x: x, y: y, koma: INITIAL_SHOGI_BOARD[y][x] };
      }
    }
  }
}
