import {Component} from '@angular/core';

import {TileComponent} from '../tile/tile.component';
import {Tile} from '../interfaces/tile';
import {INITIAL_SHOGI_BOARD, Koma} from '../interfaces/koma';
import {HandComponent} from '../hand/hand.component';

@Component({
  selector: 'shogi-board',
  imports: [TileComponent, HandComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  boardTiles: Tile[][] = [];
  senteKomas: Koma[] = [];
  goteKomas: Koma[] = [];

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

  handleTileDrop(tile: Tile): void {
    if (this.selectedTile) {
      this.updateBoard(this.selectedTile, tile);
    }
  }

  handleTileUnselect() {
    this.selectedTile = undefined;
  }

  handleTileSelect(tile: Tile) {
    this.selectedTile = tile;
  }

  updateBoard(selectedTile : Tile,targetedTile: Tile) {
    if(selectedTile.y === targetedTile.y && selectedTile.x === targetedTile.x) {
      return;
    }if(selectedTile.koma?.player === targetedTile.koma?.player){
      return;
    }
    this.boardTiles[selectedTile.y][selectedTile.x] = {x: selectedTile.x, y: selectedTile.y, koma: undefined} ;

    selectedTile.x = targetedTile.x;
    selectedTile.y = targetedTile.y;

    if(targetedTile.koma?.player === 'gote'){
      targetedTile.koma.player = 'sente';
      this.senteKomas.push(targetedTile.koma);
        this.senteKomas = [...this.senteKomas]
    }else if(targetedTile.koma?.player === 'sente'){
        targetedTile.koma.player = 'gote';
        this.goteKomas.push(targetedTile.koma);
        this.goteKomas = [...this.goteKomas]
    }

    this.boardTiles[targetedTile.y][targetedTile.x] = selectedTile ;
  }
}
