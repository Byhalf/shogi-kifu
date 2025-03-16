import { Component } from '@angular/core';

import { TileComponent } from '../tile/tile.component';
import { Tile } from '../tile';

@Component({
  selector: 'app-board',
  imports: [TileComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  readonly boardTiles: Array<Tile> = new Array();
  readonly width: number = 9;
  constructor() {
    // index 1 for kifu
    const heigth = this.width;
    for (let x: number = 0; x < this.width; x++) {
      for (let y: number = 0; y < heigth; y++) {
        this.boardTiles[x + y * this.width] = { x: x, y: y };
      }
    }
  }
}
