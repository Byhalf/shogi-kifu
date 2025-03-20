import {Component} from '@angular/core';

import {TileComponent} from '../tile/tile.component';
import {Tile} from '../interfaces/tile';
import {INITIAL_SHOGI_BOARD} from '../interfaces/koma';

@Component({
  selector: 'shogi-board',
  imports: [TileComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  boardTiles: Tile[][] = [];

  readonly width: number = 9;
  constructor() {
    for (let y: number = 0; y < this.width; y++) {
      this.boardTiles[y] = []; // Initialize each row as an array
      for (let x: number = 0; x < this.width; x++) {
        this.boardTiles[y][x]  = { x: x, y: y, koma: INITIAL_SHOGI_BOARD[y][x] };
      }
    }
  }

  selectedTile: Tile|undefined
  targetedTile: Tile|undefined;

  handleTileDrop(tile: Tile): void {
    console.log('Tile dropped:', tile);
    this.targetedTile = tile;
    if (this.selectedTile) {
      this.updateBoard(this.selectedTile, this.targetedTile);
    }
  }

  handleTileUnselect(tile: Tile) {
    console.log('Tile unselected :', tile);
    this.selectedTile = undefined;
  }

  handleTileSelect(tile: Tile) {
    console.log('Tile selected:', tile);
    this.selectedTile = tile;
  }

  updateBoard(selectedTile : Tile,targetedTile: Tile) {
    console.log('Update board');

    this.boardTiles[selectedTile.y][selectedTile.x] = {x: selectedTile.x, y: selectedTile.y, koma: undefined} ;

    selectedTile.x = targetedTile.x;
    selectedTile.y = targetedTile.y;

    this.boardTiles[targetedTile.y][targetedTile.x] = selectedTile ;

    //this.boardTiles = [...this.boardTiles]; // Triggers change detection
  }
}
